import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

//socket
import { Stomp } from "@stomp/stompjs";

//component
import Button, { colors } from "./components/Button";
import UploadPopup from "./components/UploadPopup";

import LinearProgress from "@mui/material/LinearProgress";

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
  }
  .name {
    cursor: pointer;
  }
`;

const tempData = [
  {
    topic: "123123",
    totla: 7,
    compelete: 3,
    converting: 4,
    progress: "50",
    files: [
      { name: "file1" },
      { name: "file2" },
      { name: "file3" },
      { name: "file4" },
    ],
  },
];

//socket 연결
//real
const socket = new WebSocket("ws://192.168.0.67:8080/ws");
//test
// const socket = new WebSocket("ws://localhost:8080/ws");
const stompClient = Stomp.over(socket);

function App() {
  //1. 파일 추가 누르면 파일선택 팝업
  //2. 변환 선택시 api로 파일전송 후 res값으로 해당 파일 key값받음
  //3. ws으로 파일 변환 상태값 갱신
  const [upLoadList, setUpLoadList] = useState();

  const [openModal, setOpenModal] = useState(false);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  //socket
  const sendMessage = () => {
    if (isConnected) {
      stompClient.send("/sub/message", {}, "1");
    } else {
      console.log("STOMP 연결이 활성화되지 않았습니다.");
    }
  };

  const [message, setMessage] = useState();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    //인자 1: 헤더 , 2:성공 콜백, 3:실패 콜백
    stompClient.connect(
      {}, //header
      function (frame) {
        //연결 성공시 콜백 함수
        console.log("Connected: " + frame);
        setIsConnected(true); // 연결이 성공하면 상태 업데이트

        //구독
        stompClient.subscribe("/pub/message", function (message) {
          console.log("메시지 수신:", message);
          setMessage(JSON.parse(message.body).content);
        });
      },
      function (error) {
        // 연결 실패 시 콜백함수
        setIsConnected(false);
        console.log("Connection error: " + error);
      }
    );

    return () => {
      if (stompClient) {
        //인자 1: 성공콜백 , 2: 헤더
        stompClient.disconnect(() => {
          //연결 해제 성공시 콜백 함수
          console.log("Disconnected");
          setIsConnected(false); // 연결 해제 시 상태 업데이트
        });
      }
    };
  }, []);

  //이미지 미리보기
  const previewImage = (progress, imageUrl) => {
    if (progress === "100") {
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
    }
  };

  const [addList, setAddList] = useState(false);

  return (
    <AppWrap addlist={addList.toString()}>
      <ContentWrap>
        <div>
          <Button onClick={handleModalOpen}>파일추가</Button>
        </div>

        <Button onClick={sendMessage} disabled={!isConnected}>
          메세지보내기 테스트용
        </Button>
      </ContentWrap>

      <ContentWrap addlist={addList.toString()}>
        {tempData.map((data, index) => (
          <ListWrap key={index}>
            <div className='title'>{data.topic}</div>
            <LinearProgress
              color={data.progress === "100" ? "success" : "primary"}
              variant='determinate'
              value={data.progress}
            />

            {data.files?.map((file, index) => (
              <div
                key={index}
                className='name'
                onClick={() => previewImage(file.progress, "image.jpg")}
              >
                {file.name}
              </div>
            ))}
          </ListWrap>
        ))}
      </ContentWrap>
      <div onClick={() => setAddList((prev) => !prev)}>
        {addList ? "닫기" : "더보기"}
      </div>
      <UploadPopup openModal={openModal} handleModalClose={handleModalClose} />
    </AppWrap>
  );
}

export default App;
