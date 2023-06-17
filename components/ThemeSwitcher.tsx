import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {ActionIcon, useMantineColorScheme} from "@mantine/core";


export default function ThemeSwitcher() {
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const dark = colorScheme == 'dark';
    return (
        <ActionIcon
            variant={"outline"}
            color={dark ? "yellow" : "blue"}
            onClick={() => toggleColorScheme()}
            title={"Toggle color scheme"}
        >
            {dark ? <IconSun size="1.1rem"/> : <IconMoonStars size="1.1rem"/>}

        </ActionIcon>
    )
}
