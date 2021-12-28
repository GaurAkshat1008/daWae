import {
  Container,
  Divider,
  Heading,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createURQLClient } from "../../utils/createURQLClient";

const Post = ({}) => {
  const router = useRouter();
  const intId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  if (fetching) {
    return <Layout>Loading...</Layout>;
  }
  if (error) {
    console.log(error.message);
    return <div>{error.message}</div>;
  }
  if (!data?.post) {
    return (
      <Layout>
        <Flex justifyContent={"center"} direction={"column"}>
          Oops! there is nothing here
        </Flex>
      </Layout>
    );
  }
  return (
    <Layout variant="large">
      <Box flex={1}>
        <Heading w={"100%"}>{data.post.title}</Heading>
        <Flex>
          <Text m={4} flex={1} fontSize={"sm"} color={"gray.400"}>
            {data.post.creator.username}
          </Text>
        </Flex>
      </Box>
      <Divider orientation="horizontal" />
      <Container mt={10} maxW={"container.lg"} size={"24px"}>
        {data.post.text}
      </Container>
    </Layout>
  );
};
export default withUrqlClient(createURQLClient, { ssr: true })(Post);
