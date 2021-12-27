import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpDootSectionProps {
  posts: PostSnippetFragment;
}

export const UpDootSection: React.FC<UpDootSectionProps> = ({ posts }) => {
  const[loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
  const [, vote] = useVoteMutation()
  return (
    <Flex
      direction={"column"}
      mr={4}
      mt={2}
      mb={2}
      justifyContent={"center"}
      alignItems={"center"}
      >
      <IconButton
      onClick={async() =>{
        setLoadingState('updoot-loading')
        await vote({
          postId: posts.id,
          value: 1
        })
        setLoadingState('not-loading')
      }}
      isLoading = {loadingState === "downdoot-loading"}
        aria-label="upDoot"
        size={"md"}
        variant={"outline"}
        icon={<ChevronUpIcon />}
        isRound
      />
      <Text color={posts.points >= 0 ? "green.500" : "red.500"}>
        {posts.points}
      </Text>
      <IconButton
        aria-label="downDoot"
        onClick={async() =>{
        setLoadingState('downdoot-loading')
        await vote({
          postId: posts.id,
          value: -1
        })
        setLoadingState('not-loading')
        }}
        isLoading = {loadingState === "downdoot-loading"}
        size={"md"}
        variant={"outline"}
        icon={<ChevronDownIcon />}
        isRound
      />
    </Flex>
  );
};
