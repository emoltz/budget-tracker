import {Container, Skeleton} from "@mantine/core";

const RECTANGLE_HEIGHT = "300px"; // You can set this to whatever height you want
const RECTANGLE_WIDTH = "100%"; // This will make the skeleton take up the full width of its container

export default function LoadingAtAGlance() {
    return (
        <Container my="md">
            <Skeleton height={RECTANGLE_HEIGHT} width={RECTANGLE_WIDTH} radius="md" animate={false}/>
        </Container>
    );
}
