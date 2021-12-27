import { Box, Button, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createURQLClient } from '../utils/createURQLClient';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from "next/link"

interface registerProps { }

const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter()
    const [,register] = useRegisterMutation();
    return (
        <Wrapper variant='small'>
            <Formik initialValues={{email:"", username: "", password: "" }} 
            onSubmit={async (values, { setErrors }) => {
               const response = await register({options:values})
               if(response.data?.register.errors){
               setErrors(toErrorMap(response.data.register.errors))
            } else if(response.data?.register.user){
                //worked
                router.push("/")
            }
            }}>
                {(props) => (
                    <Form>
                        <InputField name='username' placeholder='username' label='Username' />
                        <Box mt={4}>
                            <InputField name='email' placeholder='email' label='Email' type={'email'} />
                        </Box>
                        <Box mt={4}>
                            <InputField name='password' placeholder='password' label='Password' type={'password'} />
                        </Box>
                        <Flex color={'blue.100'} cursor={'pointer'} direction={'column'}>
                            <NextLink href={"/login"}><Box ml={'auto'} mt={2}>Already a User?</Box></NextLink>
                        <Button mt={4} colorScheme='teal' isLoading={props.isSubmitting} type='submit'>Register</Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createURQLClient)(Register)