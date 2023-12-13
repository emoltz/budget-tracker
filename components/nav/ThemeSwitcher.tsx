import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {ActionIcon, useMantineColorScheme} from "@mantine/core";


export default function ThemeSwitcher() {
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const dark = colorScheme == 'dark';
    return (
        <ActionIcon
            variant={"outline"}
            color={dark ? "blue" : "yellow"}
            onClick={() => toggleColorScheme()}
            title={"Toggle color scheme"}
        >
            {dark ? <IconMoonStars size="1.1rem"/> : <IconSun size="1.1rem"/>}

        </ActionIcon>
    )
}
