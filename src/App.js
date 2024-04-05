import { useRef, useState } from "react";
import styled from "styled-components";
import Modal from "./components/Modal/index";
import Button, { colors } from "./components/Button";

const AppWrap = styled.div`
  padding: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10%;
`;

const ListWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadPopup = styled.div`
  width: 700px;
  height: 100%;
  padding: 10%;

  .contentWrap {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .row {
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 24px;
        font-weight: 700;
        line-height: 26px;
      }
      .inputBoxWrap {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;

        width: 100%;
        margin-bottom: 6px;
        .inputBox {
          border-radius: 6px;
          border: 1px solid ${colors.grayD2D2D2};
          background: ${colors.whiteFFF};
          width: 100%;

          padding: 13px 15px;

          font-family: "Pretendard Variable", "sans-serif";
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          color: ${colors.black222};

          &::placeholder {
            color: ${colors.grayAAA};
          }
          &:disabled {
            background: ${colors.grayF7F7F7};
            border-color: ${colors.grayEEE};
            color: ${colors.grayD2D2D2};
          }
        }
        .fileinputWrap {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 8px;
          .fileinput {
            display: flex;
            justify-content: center;
            align-items: center;

            //border: 1px solid $gray-AAA;
            border-radius: 6px;
            //background: $white-FFF;
            background: ${colors.primaryBlue};

            min-width: 85px;
            height: 48px;

            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            //color: $black-222;
            color: ${colors.whiteFFF};

            padding: 0px 0px;
            cursor: pointer;
            &:hover {
              background: ${colors.blue0F5BC9};
            }
          }
        }
      }
    }
  }
  .btnWrap {
    cursor: pointer;

    display: flex;
    justify-content: center;

    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
  }
`;

function App() {
  //1. 파일 추가 누르면 파일선택 팝업
  //2. 변환 선택시 api로 파일전송 후 res값으로 해당 파일 key값받음
  //3. ws으로 파일 변환 상태값 갱신
  const [upLoadList, setUpLoadList] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const fileRef = useRef(null); // 업로드 파일 input ref 삭제시 필요

  const [thumbnail, setThumbnail] = useState(""); // 업로드 파일

  // 이미지 업로드 파일 선택 이벤트
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 첫 번째 선택한 파일 가져오기
    setFile(file);
    console.log(file);

    // 썸네일 생성
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnail(null);
    }
  };

  //선택 이미지 삭제
  const deleteFile = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setFile(null);
    setThumbnail("");
  };

  return (
    <AppWrap>
      <button onClick={handleModalOpen}>파일추가</button>
      <ListWrap></ListWrap>
      <Modal
        isOpen={openModal}
        handleClose={handleModalClose}
        children={
          <UploadPopup>
            <div className='contentWrap'>
              <div className='row'>
                <span className='title'>파일업로드</span>
                <span className='btnWrap' onClick={handleModalClose}>
                  X
                </span>
              </div>
              <div className='row'>
                <div className={"inputBoxWrap"}>
                  <input
                    className={"inputBox"}
                    value={file && file.name}
                    placeholder={"등록할 파일 선택"}
                    disabled={true}
                  />
                  <div className={"fileinputWrap"}>
                    <label htmlFor={"imgInput"} className={"fileinput"}>
                      파일선택
                    </label>
                    <Button
                      border={"outline"}
                      buttonColor={"lightGray"}
                      height={"48"}
                      width={"85px"}
                      onClick={deleteFile}
                    >
                      삭제
                    </Button>
                    <input
                      type='file'
                      id={"imgInput"}
                      accept='.xlsx, .xls' // 이미지 파일만 선택 가능하도록 설정
                      style={{ display: "none" }} // 실제로 보이지 않게 숨김/
                      onChange={(e) => handleFileChange(e)} // 파일 선택 변경 이벤트 핸들러 연결
                      ref={fileRef}
                    />
                  </div>
                </div>
              </div>
              <div className='btnWrap'>
                <Button
                  type={"solid"}
                  buttonColor={"blue"}
                  height={"60"}
                  width={"130px"}
                  // 엑셀 다운로드 API call 및 다운로드 진행 함수
                  onClick={() => {}}
                  disabled={file === null}
                >
                  수정 업로드
                </Button>
              </div>
            </div>
          </UploadPopup>
        }
      />
    </AppWrap>
  );
}

export default App;
