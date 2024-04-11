import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

//socket
import { Stomp } from "@stomp/stompjs";

//component
import Button, { colors } from "./components/Button";
import UploadPopup from "./components/UploadPopup";

import LinearProgress from "@mui/material/LinearProgress";
import useManualApi from "./hooks/useManualApi";
import API_ENDPOINTS from "./endpoints/apiEndpoints";

const AppWrap = styled.div`
  padding: 10% 10% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  ${({ addlist }) =>
    addlist === "false"
      ? css`
          height: 100vh;
        `
      : css`
          padding-right: calc(10% - 12px);
        `};
`;

const ContentWrap = styled.div`
  padding-top: 5%;
  width: 100%;
  padding: 0 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  ${({ addlist }) =>
    addlist === "false" &&
    css`
      overflow: hidden;
    `};

  .content {
    width: 100%;
    .taskId {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;

      margin-bottom: 20px;
    }
  }
`;

const ListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 40px;
  .title {
    font-size: 24px;
    font-weight: 900;
    line-height: 26px;

    display: flex;
    align-items: center;
    gap: 20px;

    .green {
      color: ${colors.green};
    }
    .blue {
      color: ${colors.blue0F5BC9};
    }
  }
  .name {
    cursor: pointer;
  }
`;

//socket 연결
//real
const socket = new WebSocket("ws://192.168.0.67:8080/ws");
const client = Stomp.over(socket);

function App() {
  const [upLoadList, setUpLoadList] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [taskId, setTaskId] = useState(null);

  const handleModalOpen = () => {
    setOpenModal(true);
    // if (isConnected) {
    //   setOpenModal(true);
    // } else {
    //   alert("서버와 연결 상태를 확인해주세요.");
    // }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  //=========socket START===========

  //roomId 생성 api
  const {
    response: roomRes,
    loading,
    error,
    execute,
  } = useManualApi("get", API_ENDPOINTS.getRoom);

  //완료 이미지 가져오기
  const {
    response: fileRes,
    loading: fileLoading,
    error: fileError,
    execute: fileExecute,
  } = useManualApi("get", API_ENDPOINTS.getFiles(taskId));

  const [isConnected, setIsConnected] = useState(false); //현재 ws 연결상태

  //1. 최초 렌더시 방 ID 생성
  useEffect(() => {
    //방 ID 생성
    execute();

    //현재 페이지 닫힐때 소켓 연결해제
    return () => {
      if (client && client.connected) {
        //인자 1: 성공콜백 , 2: 헤더
        client.disconnect(() => {
          //연결 해제 성공시 콜백 함수
          console.log("Disconnected");
          setIsConnected(false); // 연결 해제 시 상태 업데이트
        });
      }
    };
  }, []);

  //2. 소켓 연결 후 생성된 방 ID로 구독
  useEffect(() => {
    if (roomRes) {
      console.log(`구독 URL : /sub/message/${roomRes.result}`);
      setRoomId(roomRes.result);

      //소켓 연결 함수
      const connectClient = () => {
        console.log("connectClient");
        //인자 1: 헤더 , 2:성공 콜백, 3:실패 콜백
        client.connect(
          {}, //header
          function (frame) {
            //연결 성공시 콜백 함수
            console.log("Connected: " + frame);
            setIsConnected(true); // 연결이 성공하면 상태 업데이트
            //구독
            client.subscribe(
              `/sub/message/${roomRes.result}`,
              function (message) {
                //응답 후처리
                const taskId = JSON.parse(message.body)[0].taskId;
                const list = JSON.parse(message.body);
                let taskIndex = null;

                //현재 진행도 업데이트
                setUpLoadList((prev) => {
                  const copyList = [...prev];
                  //같은 taskId가 있는지 찾음
                  copyList.forEach((item, index) => {
                    if (item.taskId === taskId) {
                      taskIndex = index;
                    }
                  });
                  //taskIndex가 있는경우 교체
                  if (taskIndex || taskIndex === 0) {
                    copyList[taskIndex] = {
                      taskId,
                      list,
                    };
                  } else {
                    //아닌경우 새로 생성
                    copyList.push({ taskId, list });
                  }
                  return copyList;
                });

                //task 전체 완료된경우 파일가져오기 로직(구현중..)
                let count = 0;

                list.forEach((data) => {
                  if (data.progress === 100) {
                    count++;
                  }
                });

                if (list.length === count) {
                  setTaskId(taskId);
                }
              }
            );
          },
          function (error) {
            // 연결 실패 시 콜백함수
            setIsConnected(false);
            console.log("Connection error: " + error);
            // 1초 후에 재시도
            setTimeout(connectClient, 1000);
          }
        );
      };

      // 최초 연결 시도
      connectClient();
    }
  }, [roomRes]);

  // //파일가져오기 API 호출
  useEffect(() => {
    if (taskId) {
      fileExecute();
    }
  }, [taskId]);

  //파일 가져오기 res update
  useEffect(() => {
    if (fileRes) {
      console.log(fileRes);
      // setUpLoadList((prev) => {
      //   const copyList = [...prev];
      // });
    }
  }, [fileRes]);

  console.log(upLoadList);

  //=========socket END===========

  //이미지 미리보기
  const previewImage = (imageUrl) => {
    const imageWindow = window.open("", "_blank");
    imageWindow.document.write(`
    <html>
      <head>
        <title>Image Preview</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.9);
          }
          img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" alt="Image preview">
      </body>
    </html>
  `);
    imageWindow.document.close();
  };

  const [addList, setAddList] = useState(false);

  return (
    <AppWrap addlist={addList.toString()}>
      <ContentWrap>
        <div>
          <Button onClick={handleModalOpen}>파일추가</Button>
        </div>

        <Button disabled={!isConnected}>소켓 연결상태</Button>
      </ContentWrap>

      <ContentWrap addlist={addList.toString()}>
        {upLoadList.map((data, index) => (
          <div className='content' key={index}>
            <div className='taskId'>{data.taskId}</div>
            {data.list?.map((item) => (
              <ListWrap key={index}>
                <div className='title'>
                  <span>{item.folderName}</span>
                  <span>전체 : {item.totalImages}</span>
                  <span className='blue'>진행중 : {item.convertingImages}</span>
                  <span className='green'>완료 : {item.completedImages}</span>
                </div>
                <LinearProgress
                  color={item.progress === 100 ? "success" : "primary"}
                  variant='determinate'
                  value={item.progress}
                />

                {/* {data.files &&
              data.files?.map((file, index) => (
                <div
                  key={index}
                  className='name'
                  onClick={() => previewImage("image.jpg")}
                >
                  {file.name}
                </div>
              ))} */}
              </ListWrap>
            ))}
          </div>
        ))}
      </ContentWrap>
      <div onClick={() => setAddList((prev) => !prev)}>
        {addList ? "닫기" : "더보기"}
      </div>
      <UploadPopup
        openModal={openModal}
        handleModalClose={handleModalClose}
        roomId={roomId}
      />
    </AppWrap>
  );
}

export default App;
