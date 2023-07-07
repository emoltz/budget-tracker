import {ReactElement} from "react";
import {Grid} from "@mantine/core"

interface Props {
    one: ReactElement;
    two: ReactElement;
    three: ReactElement;
    four: ReactElement;
}

export const FourColumnLayout = ({one, two, three, four}: Props) => {

    return (
        <div className={"p-3"}>
            <Grid grow
                  gutter={"sm"}
                  columns={10}
            >
                <Grid.Col span={"content"}>
                    {two}
                </Grid.Col>
                <Grid.Col span={"content"}>
                    {one}
                </Grid.Col>
                <Grid.Col span={"content"}>
                    {three}
                </Grid.Col>
                <Grid.Col span={"content"}>
                    {four}
                </Grid.Col>
            </Grid>
        </div>
    )
}