import {
  Box,
  Button,
  Flex,
  flexbox,
  Heading,
  Icon,
  IconButton,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { usePostsQuery } from "../generated/graphql";
import { createURQLClient } from "../utils/createURQLClient";
import { useState } from "react";
import { graphqlSync } from "graphql";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching, stale }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <Box>You got query falied for some reason</Box>;
  }
  return (
    <Layout>
      <Flex alignContent={"center"}>
        <Heading>DaWae</Heading>
        <Button
          variant={"outline"}
          backgroundColor={"teal.500"}
          mb={8}
          ml={"auto"}
        >
          <NextLink href={"/create-post"}>Create Post</NextLink>
        </Button>
      </Flex>
      {stale || (fetching && !data) ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <Stack spacing={8} mb={4}>
          {data!.posts.posts.map((p) => (
            <Flex key={p.id} p={2} shadow="md" borderWidth="1px">
              <Flex
                direction={"column"}
                mr={4}
                mt={2}
                mb={2}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <IconButton aria-label='upDoot' size={'md'} variant={'outline'} icon={<ChevronUpIcon/>} isRound/>
                <Text color={p.points >= 0 ? "green.500" : "red.500"}>
                  {p.points}
                </Text>
                <IconButton aria-label='downDoot' size={'md'} variant={'outline'} icon={<ChevronDownIcon/>} isRound/>
              </Flex>
              <Box>
                <Text fontSize={"xs"} color={"gray.500"}>
                  posted by d\{p.creator.username}
                </Text>
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4} isTruncated>
                  {p.textSnippet}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            m={"auto"}
            my={8}
            variant={"ghost"}
            backgroundColor={"Highlight"}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
export default withUrqlClient(createURQLClient, { ssr: true })(Index);
