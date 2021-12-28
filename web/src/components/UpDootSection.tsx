import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpDootSectionProps {
  post: PostSnippetFragment;
}

export const UpDootSection: React.FC<UpDootSectionProps> = ({ post }) => {
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
          postId: post.id,
          value: 1
        })
        setLoadingState('not-loading')
      }}
      isLoading = {loadingState === "downdoot-loading"}
      colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        aria-label="upDoot"
        size={"md"}
        variant={post.voteStatus === 1 ? "solid" : "outline"}
        icon={<ChevronUpIcon />}
        isRound
        />
      <Text color={post.points >= 0 ? "green.500" : "red.500"}>
        {post.points}
      </Text>
      <IconButton
        aria-label="downDoot"
        onClick={async() =>{
          setLoadingState('downdoot-loading')
          await vote({
            postId: post.id,
            value: -1
          })
          setLoadingState('not-loading')
        }}
        colorScheme={post.voteStatus === -1?'red' :undefined}
        isLoading = {loadingState === "downdoot-loading"}
        size={"md"}
        variant={post.voteStatus === -1 ? "solid" : "outline"}
        icon={<ChevronDownIcon />}
        isRound
      />
    </Flex>
  );
};
