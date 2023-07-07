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
            <Grid.Col span={4}>
                {upLeft}
            </Grid.Col>
            <Grid.Col span={4}>
                {upRight}
            </Grid.Col>
            <Grid.Col span={4}>
                {downLeft}
            </Grid.Col>
            <Grid.Col span={4}>
                {downRight}
            </Grid.Col>
        </Grid>
    )
}