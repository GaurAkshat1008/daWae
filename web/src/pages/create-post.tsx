import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import {useRouter} from "next/router";
import { InputField } from "../components/InputField";
import { useCreatePostMutation} from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createURQLClient } from "../utils/createURQLClient";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter()
    useIsAuth()
    const [, createPost] = useCreatePostMutation()
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const {error} = await createPost({input:values})
          if(!error){
            router.push('/')
          }
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
                Create
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createURQLClient)(CreatePost);
