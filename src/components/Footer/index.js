import React from "react";
import styled, { css } from "styled-components";

import Logo from "../../images/gloomyxdoge.svg";

function Landing() {
  return (
    <Section>
      <Img src={Logo} />
    </Section>
  );
}

export default Landing;

const Section = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding-bottom: 50px;
`;

const Img = styled.img`
  height: 50%;
  max-height: 60px;
  min-height: 40px;
`;
