//#1a202c background color
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(), 
  });
  
  let body = null;
  if (fetching) {
    //user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href={"/register"}>
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex >
        <Box mr={3}>{data.me.username}</Box>
        <Button
          backgroundColor={"red.500"}
          variant={"ghost"}
          onClick={() => {
            return logout();
          }}
          isLoading={logoutFetching}
        >
          Log Out
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position={'sticky'} top={0} zIndex={1} bg="#AABBCC" p={4} mb={8}>
      <Box ml={"auto"} fontSize={20} fontWeight={600} fontFamily={'heading'}>
        {body}
      </Box>
    </Flex>
  );
};
