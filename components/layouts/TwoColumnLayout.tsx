import {ReactElement} from "react";

interface Props{
    leftComponent: ReactElement;
    rightComponent: ReactElement;
}

export const TwoColumnLayout = ({ leftComponent, rightComponent}: Props) => {
    return (
        <div className={"flex flex-col md:flex-row w-full min-h-screen"}>
            <div className={"w-full md:w-1/2 p-4"}>
                {leftComponent}
            </div>
            <div className={"w-full md:w-1/2 p-4"}>
                {rightComponent}
            </div>
        </div>
    )
}