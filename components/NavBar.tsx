import {useState} from 'react';
import {createStyles, Navbar, Group, Code, getStylesRef, rem} from '@mantine/core';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
    IconChartPie3,
    IconChartAreaLine,
    IconMoneybag,
    IconDashboard,
} from '@tabler/icons-react';
import Link from 'next/link';


const useStyles = createStyles((theme) => ({
    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,

            [`& .${getStylesRef('icon')}`]: {
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
            },
        },
    },
}));

const data = [
    {link: '/', label: 'Dashboard', icon: IconDashboard},
    {link: '#', label: 'Analysis', icon: IconChartAreaLine},
    {link: '/expenses', label: 'Expenses', icon: IconReceipt2},
    {link: '/budgets', label: 'Budgets', icon: IconMoneybag},
    {link: '/settings', label: 'Settings', icon: IconSettings},
];

export default function NavBar() {
    const {classes, cx} = useStyles();
    const [active, setActive] = useState('Dashboard');

    const links = data.map((item) => (
        <Link
            className={cx(classes.link, {[classes.linkActive]: item.label === active})}
            href={item.link}
            key={item.label}
            onClick={(event) => {

                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5}/>
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <Navbar
            width={{sm: 300}} p="md"
        >
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    Argonaut
                    <Code sx={{fontWeight: 700}}>v0.1</Code>
                </Group>
                {links}

            </Navbar.Section>

            <Navbar.Section className={classes.footer}>

                <Link href="/login" className={classes.link} >
                    <IconFingerprint className={classes.linkIcon} stroke={1.5}/>
                    <span>My Profile</span>
                </Link>

                <Link href="/login" className={classes.link}>
                    <IconLogout className={classes.linkIcon} stroke={1.5}/>
                    <span>Logout</span>
                </Link>
            </Navbar.Section>
        </Navbar>
    );
}