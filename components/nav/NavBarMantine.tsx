"use client";
import {useEffect, useState} from 'react';
import {Code, createStyles, getStylesRef, Group, Navbar, rem, useMantineColorScheme} from '@mantine/core';
import {
    IconArrowsExchange,
    IconChartAreaLine,
    IconDashboard,
    IconFingerprint,
    IconLogout,
    IconMoneybag,
    IconReceipt2,
    IconSettings,
} from '@tabler/icons-react';
import Link from 'next/link';
import {auth} from "@/lib/firebase";
import ThemeSwitcher from "@/components/nav/ThemeSwitcher";

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
    // TODO honestly re-do navbar from scratch with tailwind. I can't fix the dumb bugs with this component. It's not worth it.

    // COLLAPSE
    const [collapsed, setCollapsed] = useState(false);
    const {colorScheme} = useMantineColorScheme();
    const animationDuration = 100;
    const [animationCompleted, setAnimationCompleted] = useState(true);

    useEffect(() => {
        setAnimationCompleted(false);
        const timer: NodeJS.Timeout = setTimeout(() => {
            setAnimationCompleted(true);
        }, animationDuration);
        return () => clearTimeout(timer);
    }, [animationDuration, collapsed])

    const {classes, cx} = useStyles();
    const [active, setActive] = useState('Dashboard');

    const links = data.map((item) => (
        <Link
            className={cx(classes.link, {[classes.linkActive]: item.label === active})}
            href={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5}/>
            {!collapsed && <span>{item.label}</span>}
        </Link>
    ));
    // TODO make sure the navbar is fixed to the left side of the screen
    return (
        <Navbar
            className={`h-screen transition-all duration-${animationDuration} ease-in-out`}
            style={{
                width: collapsed ? '80px' : '300px',
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
                    {animationCompleted && !collapsed && <div
                        className={`text-2xl font-bold font-mono transition-all duration-${animationDuration} ease-in-out ${colorScheme === 'dark' ? 'text-white' : 'text-gray-700'}`}
                    >
                        Argonaut </div>}
                    {animationCompleted && !collapsed &&
                        <Code sx={{fontWeight: 700}}>v0.1</Code>
                    }
                    {animationCompleted && !collapsed &&
                        <ThemeSwitcher/>
                    }
                    <div
                        className={`cursor-pointer ${collapsed ? 'ml-2' : ''}`}
                        onClick={() => {
                            setCollapsed(!collapsed);
                            setAnimationCompleted(false);
                        }}
                    >
                        <IconArrowsExchange
                            color={colorScheme === 'dark' ? '#b3b8e6' : 'black'}
                        />
                    </div>
                </Group>
                {links.map((link) => (
                    <div key={link.key}>
                        {link}
                    </div>
                ))}


            </Navbar.Section>

            <Navbar.Section className={classes.footer}>

                <Link href={"/login"} className={classes.link}>
                    <IconFingerprint className={classes.linkIcon} stroke={1.5}/>
                    {!collapsed && <span>My Profile</span>}
                </Link>

                <Link href={"/login"} className={classes.link}>
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