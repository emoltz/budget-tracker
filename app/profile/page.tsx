"use client";
//import {Button} from "@/components/ui/button";
import { TextInput, Button, Image, Paper, Flex, Center, FileButton,
    Modal, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from "@/app/context";
import LoginMantine from "@/components/LoginMantine";
import Loading from "@/app/loading";
import { updateProfile, updateEmail, deleteUser, User } from "firebase/auth";

import { useDisclosure } from '@mantine/hooks';


export default function page(){
    const {user, loading} = useAuth();
    const [opened, { close, open }] = useDisclosure(false);

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


    if (loading) {
        return <Loading/>; // Or return a loading spinner
    }

    if (!user) {
        return <LoginMantine/>;
    }

    const profileURL = user?.photoURL ? user.photoURL : "/default_profile_pic.webp"

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

                <Image 
                    maw={240} 
                    mx="auto" 
                    radius="50%" 
                    src={profileURL} 
                    alt="Profile image" 
                    imageProps={{referrerPolicy : "no-referrer"}}
                    />
            

                <Center mx="auto">
                    
                    <Flex direction={"column"} w={500} align={"center"} gap={"lg"}>
                        <div className='py-3'>
                            <FileButton onChange={() => alert('Profile pic updated')} accept="image/png, image/jpeg, image/svg">
                                {(props) => <Button variant={"outline"} {...props}>Upload image</Button>}
                            </FileButton>
                        </div>

                        <form onSubmit={nameForm.onSubmit((values) => { 
                            if (user != null) {
                                updateProfile(user, {
                                    displayName: values.name,
                                }).then(() => {
                                    alert('New name is: ' + values.name);
                                }).catch((error) => {
                                    alert('Error assigning new name, ' + error);
                            });
                            }
                        })}>

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

                        <form onSubmit={emailForm.onSubmit((values) => { 
                            if (user != null) {
                                updateEmail(user, values.email
                                ).then(() => {
                                    alert('New email is: ' + values.email);
                                }).catch((error) => {
                                    alert('Error assigning new email, ' + error);
                                });
                            }         
                        })}>
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

                        <Button variant={"outline"} mt={4}>Change Password</Button>
                        
                        <DeleteAcctModal user={user} opened={opened} close={close}/>
                        <Button onClick={open}
                            variant={"light"} color={"red"}>Delete Account
                        </Button>

                    </Flex>

                </Center>

            </Paper>
        
        </div>
             )
}

interface ModalProps {
    opened: boolean, 
    close: () => void,
    user: User
}

function DeleteAcctModal({ opened, close, user }: ModalProps) {
    return (
      <>
        <Modal opened={opened} onClose={close} size="auto" title="Account Removal">
          <p>This action cannot be undone!</p>
  
          <Group mt="xl">
            <Button variant="outline" 
                    color={"red"} 
                    onClick={() =>  { 
                        if (user != null) {
                            deleteUser(user
                            ).then(() => {
                                alert('Account has been deleted for: ' + user.displayName);
                            }).catch((error) => {
                                alert('Error deleting account: ' + error);
                            });
                        }
                        close()
                    }}>
              Yes
            </Button>
            <Button 
                variant="outline" 
                onClick={close}>
                I changed my mind
            </Button>
          </Group>
        </Modal>
      </>
    );
  }