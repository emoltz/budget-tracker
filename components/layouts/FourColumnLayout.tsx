import {ReactElement} from "react";
import {Grid} from "@mantine/core"

interface Props {
    upRight: ReactElement;
    upLeft: ReactElement;
    downRight: ReactElement;
    downLeft: ReactElement;
}

export const FourColumnLayout = ({upRight, upLeft, downRight, downLeft}: Props) => {

    return (
        <Grid grow
              gutter={"sm"}
            columns={10}
        >
            <Grid.Col span={"content"}>
                {upLeft}
            </Grid.Col>
            <Grid.Col span={"content"}>
                {upRight}
            </Grid.Col>
            <Grid.Col span={"content"}>
                {downLeft}
            </Grid.Col>
            <Grid.Col span={"content"}>
                {downRight}
            </Grid.Col>
        </Grid>
    )
}