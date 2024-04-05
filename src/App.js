import { useState } from "react";
import styled from "styled-components";

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

function App() {
  //1. 파일 추가 누르면 파일선택 팝업
  //2. 변환 선택시 api로 파일전송 후 res값으로 해당 파일 key값받음
  //3. ws으로 파일 변환 상태값 갱신
  const [upLoadList, setUpLoadList] = useState();

  return (
    <AppWrap>
      <button>파일추가</button>
      <ListWrap></ListWrap>
    </AppWrap>
  );
}

export default App;
