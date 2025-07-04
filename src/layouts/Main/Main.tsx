import React from "react";
import Breadcrumbs from "@components/Header/Breadcrumbs";

interface StringTitleProp {
  pageTitle: string;
  pageDesc?: string;
}

interface ArrayTitleProp {
  pageTitle: [string, string];
  titleTransition: string;
  pageDesc?: string;
}

export type MainProps = (StringTitleProp | ArrayTitleProp) & {
  children?: React.ReactNode;
};

const Main = (props: MainProps) => {
  return (
    <>
      <Breadcrumbs />
      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 pb-4">
        {"titleTransition" in props ? (
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {props.pageTitle[0]}
            {/*
              transition:name={props.titleTransition} 부분은 React에서는
              Framer Motion, CSSTransition 등으로 대체할 수 있습니다.
              아래는 단순 span으로 대체, 실제 애니메이션이 필요하면 추가 구현 필요
            */}
            <span>{props.pageTitle[1]}</span>
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {props.pageTitle}
          </h1>
        )}
        {props.pageDesc && <p className="mb-6 mt-2 italic">{props.pageDesc}</p>}
        {props.children}
      </main>
    </>
  );
};

export default Main;
