"use client";
//import {Button} from "@/components/ui/button";
import { TextInput, Button, Image, Paper, Grid, Flex, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from "@/app/context";
import LoginMantine from "@/components/LoginMantine";
import Loading from "@/app/loading";
import ComponentFrameCenter from '@/components/layouts/ComponentFrameCenter';



export default function page(){

    const {user, loading} = useAuth();
    // if (loading) {
    //     return <Loading/>; // Or return a loading spinner
    // }

    // if (!user) {
    //     return <LoginMantine/>;
    // }

    const emailForm = useForm({
        initialValues: {
          email: '',
        },
    
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
      });

      const nameForm = useForm({
        initialValues: {
          name: '',
        },
        validate: {
            name: (value) => (/./.test(value) ? null : 'No name entered'),
          },
      });

    return (
        <div className='p-3 '> 
        
        <Paper
            shadow={"sm"}
            p={10}
            withBorder
            sx={{
                placeContent: "center"
            }}
        >
            <div className="py-4">
                <p className="text-3xl">Profile</p>
            </div>
            
            <Image maw={240} mx="auto" radius="50%" src={user?.photoURL} alt="Profile image" sx={{referrerPolicy : "no-referrer"}}/>
            {/* <div className='items-center text-center'> */}
            <Center mx="auto">
            
            

            {/* <div className="gap-1.0 px-2 w-60 md:w-96"> */}
            <Flex direction={"column"} w={500} align={"center"} gap={"lg"}>

                <form onSubmit={nameForm.onSubmit((values) => alert('New name is: ' + values.name))}>
                    {/* <div className="flex flex-row border-2 border-red-500 py-4 align-center"> */}
                    <Flex direction={"row"} align={"flex-end"} gap={"lg"}>
                        <div className="">
                            <TextInput
                                id="Display-name"
                                label="Display Name"
                                placeholder={user?.displayName===null ? "placeholder" : user?.displayName}
                                {...nameForm.getInputProps('name')}
                            />
                        </div>
                    
                        <div className="hover:bg-blue-200 ml-auto">
                            <Button variant={"outline"} type="submit">Change Name</Button>
                        </div>
                    
                    </Flex>
                </form>

            <form onSubmit={emailForm.onSubmit((values) => alert('New email is: ' + values.email))}>
                {/* <div className="flex flex-row border-2 border-red-500 py-4"> */}
                <Flex direction={"row"} align={"flex-end"} gap={"lg"}>
                        <div className="">
                            <TextInput
                                id="Email-text-input"
                                label="Email"
                                placeholder={user?.email===null ? "placeholder" : user?.email}
                                {...emailForm.getInputProps('email')}
                            />
                        </div>
                 
                            <div className="hover:bg-blue-200 ml-auto place-center">
                                <Button variant={"outline"} type="submit">Change Email</Button>
                        </div>
                    </Flex>
            </form>


            {/* <div className="flex flex-row py-4 flex-wrap justify-center"> */}
                {/* <div className="text-slate-500">
                    <h1>Password: ******</h1>
                </div> */}
                <div className="hover:bg-blue-200">
                    <Button variant={"outline"} mt={4}>Change Password</Button>
                </div>
            
           
            {/* <div className="flex flex-row border-2 border-green-500 flex-wrap justify-center py-4"> */}
                <div className="">
                    <Button color={"red"}>Delete Account</Button>
                </div>
    

            </Flex>


            </Center>

        </Paper>
        
        </div>
             )
}