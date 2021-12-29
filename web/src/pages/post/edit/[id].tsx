import { Box, Flex, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createURQLClient } from '../../../utils/createURQLClient';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';



const EditPost = ({}) => {
  const intId = useGetIntId()
  const router = useRouter()
  const [{data, fetching}] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  }
  )
  const [, updatePost] = useUpdatePostMutation()
  if(fetching){
    return(<Layout>
      Loading...
    </Layout>)
  }
  if(!data?.post){
    return (
      <Layout>Could not find post</Layout>
    )  
  }

    return (
      <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
         await updatePost({id: intId, ...values})
         router.push(`/post/${intId}`)
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="title"
              placeholder="Title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="Tell me about yourself"
                label="Body"
              />
            </Box>

            <Flex
              color={"blue.100"}
              cursor={"pointer"}
              mt={2}
              direction={"column"}
            >
              <Button
                mt={5}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
                w={'30%'}
                justifyContent={'center'}
                alignSelf={'end'}
              >
                Update
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
    );
}

export default withUrqlClient(createURQLClient)(EditPost)