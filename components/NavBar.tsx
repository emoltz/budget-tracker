import {useState} from 'react';
import {
    createStyles,
    Navbar,
    Group,
    Code,
    getStylesRef,
    rem,
    Button,
    useMantineTheme,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconFingerprint,
    IconSettings,
    IconReceipt2,
    IconLogout,
    IconChartAreaLine,
    IconMoneybag,
    IconDashboard,
    IconArrowLeft,
    IconArrowRight,
    IconArrowsExchange,
} from '@tabler/icons-react';
import Link from 'next/link';
import {auth} from "@/lib/firebase";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
        minWidth: '40px',

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
        minWidth: '24px',
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
    {link: '/analysis', label: 'Analysis', icon: IconChartAreaLine},
    {link: '/expenses', label: 'Expenses', icon: IconReceipt2},
    {link: '/budgets', label: 'Budgets', icon: IconMoneybag},
    {link: '/settings', label: 'Settings', icon: IconSettings},
];

export default function NavBar() {
    // COLLAPSE
    const [collapsed, setCollapsed] = useState(false);
    const {colorScheme} = useMantineColorScheme();

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
            {!collapsed && <span>{item.label}</span>}
        </Link>
    ));

    return (
        <Navbar
            style={{
                width: collapsed ? '60px' : '300px',
            }}

            width={{
                default: collapsed ? 60 : 100, // set default width for all screen sizes
                sm: collapsed ? 80 : 300, // override width for small screens and up
                md: collapsed ? 80 : 300, // override width for medium screens and up
            }}
            p="md"
        >
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    {!collapsed && <div
                        className={`text-2xl font-bold font-mono ${colorScheme === 'dark' ? 'text-white' : 'text-gray-700'}`}
                    >
                        Argonaut </div>}
                    <Code sx={{fontWeight: 700}}>v0.1</Code>
                    <ThemeSwitcher/>
                    <div onClick={() => setCollapsed(!collapsed)}>
                        <IconArrowsExchange/>
                    </div>
                </Group>
                {links.map((link) => (
                    <div key={link.key}>
                        {link}
                    </div>
                ))}


            </Navbar.Section>

            <Navbar.Section className={classes.footer}>

                <Link href="/login" className={classes.link}>
                    <IconFingerprint className={classes.linkIcon} stroke={1.5}/>
                    {!collapsed && <span>My Profile</span>}
                </Link>

                <Link href="/login" className={classes.link}>
                    <IconLogout className={classes.linkIcon} stroke={1.5}/>
                    {!collapsed && <div onClick={() => {
                        auth!.signOut();
                        console.log("logged out");
                    }}>Logout</div>}
                </Link>
            </Navbar.Section>
        </Navbar>
    );
}