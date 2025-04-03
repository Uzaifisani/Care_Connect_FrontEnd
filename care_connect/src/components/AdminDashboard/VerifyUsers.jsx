import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Badge,
  useToast,
  ButtonGroup
} from '@chakra-ui/react';
import { FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ListUnverified, VerifyUser, RejectUser } from '../../apis';
import { useNavigate } from 'react-router-dom';

const VerifyUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  
  // Query for fetching unverified users
  const {
    data: unverifiedUsers,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['unverifiedUsers'],
    queryFn: async () => {
      const response = await ListUnverified();
      return response.data;
    }
  });

  // Mutation for verifying users
  const verifyUserMutation = useMutation({
    mutationFn: (uid) => VerifyUser({ uid }),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "User Verified",
          description: "User has been successfully verified.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Refetch the list after successful verification
        refetch();
      } else {
        toast({
          title: "Verification Failed",
          description: response.data.message || "Could not verify user.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred during verification.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  // Mutation for rejecting users
  const rejectUserMutation = useMutation({
    mutationFn: (uid) => RejectUser({ uid }),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "User Rejected",
          description: "User has been rejected.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Refetch the list after successful rejection
        refetch();
      } else {
        toast({
          title: "Rejection Failed",
          description: response.data.message || "Could not reject user.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "An error occurred during rejection.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const verifyBgColor = useColorModeValue('green.500', 'green.300');
  const rejectBgColor = useColorModeValue('red.500', 'red.300');
  const buttonTextColor = useColorModeValue('white', 'gray.800');

  // Filter users based on search term (email in this case)
  const filteredUsers = unverifiedUsers?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyUser = (uid) => {
    verifyUserMutation.mutate(uid);
  };

  const handleRejectUser = (uid) => {
    rejectUserMutation.mutate(uid);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color="red.500">Error loading unverified users: {error?.message}</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Flex
        as="nav"
        align="center" 
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={bgColor}
        color="teal.500"
        boxShadow="md"
        mb={8}
      >
        <Heading as="h1" size="lg" letterSpacing="tight">
          Verify Users
        </Heading>
        
        <Button 
          onClick={() => navigate('/dashboard')}
          size="sm"
          colorScheme="teal"
        >
          Back to Dashboard
        </Button>
      </Flex>

      <VStack spacing={6} align="stretch">
        {/* Search Bar */}
        <InputGroup maxW="600px" mx="auto" mb={4}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: 'teal.300' }}
            _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
          />
        </InputGroup>

        {/* Users Grid */}
        {filteredUsers?.length === 0 ? (
          <Text textAlign="center" fontSize="lg" mt={10}>
            No unverified users found
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredUsers?.map((user) => (
              <Card 
                key={user._id} 
                bg={cardBgColor}
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
                borderColor="teal.100"
                borderWidth="1px"
              >
                <CardHeader bg="teal.50" py={3}>
                  <Flex justify="space-between" align="center">
                    <Badge colorScheme={user.userType === 'Doctor' ? 'blue' : user.userType === 'Staff' ? 'purple' : 'green'} px={2} py={1} borderRadius="md">
                      {user.userType}
                    </Badge>
                    <Badge colorScheme="orange" px={2} py={1} borderRadius="md">
                      Pending Verification
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody py={4}>
                  <VStack align="stretch" spacing={2}>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Email:</Text>
                      <Text>{user.email}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">User ID:</Text>
                      <Text fontSize="sm" isTruncated maxW="150px">{user.uid}</Text>
                    </HStack>
                    {user.department && (
                      <HStack justifyContent="space-between">
                        <Text fontWeight="bold">Department:</Text>
                        <Text>{user.department || 'N/A'}</Text>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
                <Divider borderColor="gray.200" />
                <CardFooter py={3} bg="gray.50">
                  <ButtonGroup spacing={4} width="full">
                    <Button
                      flex={1}
                      bg={verifyBgColor}
                      color={buttonTextColor}
                      _hover={{ bg: 'green.600' }}
                      leftIcon={<FiCheckCircle />}
                      onClick={() => handleVerifyUser(user.uid)}
                      isLoading={verifyUserMutation.isPending && verifyUserMutation.variables === user.uid}
                    >
                      Verify
                    </Button>
                    <Button
                      flex={1}
                      bg={rejectBgColor}
                      color={buttonTextColor}
                      _hover={{ bg: 'red.600' }}
                      leftIcon={<FiXCircle />}
                      onClick={() => handleRejectUser(user.uid)}
                      isLoading={rejectUserMutation.isPending && rejectUserMutation.variables === user.uid}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default VerifyUsers;