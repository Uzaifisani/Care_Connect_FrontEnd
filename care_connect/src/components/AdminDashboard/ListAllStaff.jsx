import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  IconButton
} from '@chakra-ui/react';
import { FiSearch, FiEdit } from 'react-icons/fi';
import { ListAllStaffs } from '../../apis';
import { useNavigate } from 'react-router-dom';

const ListAllStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const {
    data: staffs,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['staffs'],
    queryFn: async () => {
      const response = await ListAllStaffs();
      return response.data;
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200');
  const buttonTextColor = useColorModeValue('white', 'gray.800');

  // Filter staffs based on search term
  const filteredStaffs = staffs?.filter(staff => 
    `${staff.fname} ${staff.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStaff = (staffId) => {
    // Navigate to edit staff page with the staff ID
    navigate(`/dashboard/admin/edit-staff/${staffId}`);
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
        <Text color="red.500">Error loading staff: {error?.message}</Text>
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
          Staff Directory
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
            placeholder="Search staff by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: 'teal.300' }}
            _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
          />
        </InputGroup>

        {/* Staff Grid */}
        {filteredStaffs?.length === 0 ? (
          <Text textAlign="center" fontSize="lg" mt={10}>
            No staff found with that name
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredStaffs?.map((staff) => (
              <Card 
                key={staff._id} 
                bg={cardBgColor}
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
                borderColor="teal.100"
                borderWidth="1px"
              >
                <CardHeader bg="teal.50" py={3}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color="teal.600">
                      {staff.fname} {staff.lname}
                    </Heading>
                    <IconButton
                      icon={<FiEdit />}
                      aria-label="Edit staff"
                      size="sm"
                      colorScheme="teal"
                      variant="ghost"
                      onClick={() => handleEditStaff(staff.uid)}
                    />
                  </Flex>
                </CardHeader>
                <CardBody py={4}>
                  <VStack align="stretch" spacing={2}>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Role:</Text>
                      <Text>{staff.userType}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Email:</Text>
                      <Text fontSize="sm">{staff.email}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">User ID:</Text>
                      <Text fontSize="sm" isTruncated maxW="150px">{staff.uid}</Text>
                    </HStack>
                    {staff.workDays && staff.workDays.length > 0 && (
                      <HStack justifyContent="space-between">
                        <Text fontWeight="bold">Work Days:</Text>
                        <Text>{staff.workDays.join(', ') || 'None'}</Text>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
                <Divider borderColor="gray.200" />
                <CardFooter py={3} bg="gray.50">
                  <Button
                    w="full"
                    colorScheme="teal"
                    leftIcon={<FiEdit />}
                    onClick={() => handleEditStaff(staff.uid)}
                  >
                    Edit Staff
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default ListAllStaff;