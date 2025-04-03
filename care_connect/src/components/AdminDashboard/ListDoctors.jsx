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
  Badge,
  Spinner,
  useColorModeValue,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  IconButton,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { FiSearch, FiEdit } from 'react-icons/fi';
import { ListAllDoctors } from '../../apis';
import { useNavigate } from 'react-router-dom';

const ListDoctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const {
    data: doctors,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await ListAllDoctors();
      return response.data;
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200');
  const buttonTextColor = useColorModeValue('white', 'gray.800');

  // Filter doctors based on search term
  const filteredDoctors = doctors?.filter(doctor => 
    `${doctor.fname} ${doctor.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDoctor = (doctorId) => {
    // Navigate to edit doctor page with the doctor ID
    navigate(`/dashboard/admin/edit-doctor/${doctorId}`);
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
        <Text color="red.500">Error loading doctors: {error?.message}</Text>
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
          Doctors Directory
        </Heading>
        
        <Button 
  onClick={() => navigate('/dashboard')} // Change from '/admin/dashboard' to '/dashboard'
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
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: 'teal.300' }}
            _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
          />
        </InputGroup>

        {/* Doctors Grid */}
        {filteredDoctors?.length === 0 ? (
          <Text textAlign="center" fontSize="lg" mt={10}>
            No doctors found with that name
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredDoctors?.map((doctor) => (
              <Card 
                key={doctor._id} 
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
                      Dr. {doctor.fname} {doctor.lname}
                    </Heading>
                    <IconButton
                      icon={<FiEdit />}
                      aria-label="Edit doctor"
                      size="sm"
                      colorScheme="teal"
                      variant="ghost"
                      onClick={() => handleEditDoctor(doctor.uid)}
                    />
                  </Flex>
                </CardHeader>
                <CardBody py={4}>
                  <VStack align="stretch" spacing={2}>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Department:</Text>
                      <Text>{doctor.department || 'N/A'}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Speciality:</Text>
                      <Text>{doctor.speciality || 'N/A'}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Fee:</Text>
                      <Text>₹ {doctor.fee || 'N/A'}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Time:</Text>
                      <Text>{doctor.time || 'N/A'}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold">Email:</Text>
                      <Text fontSize="sm">{doctor.email}</Text>
                    </HStack>
                    <Box>
                      <Text fontWeight="bold" mb={1}>Work Days:</Text>
                      <Wrap>
                        {doctor.workDays?.map((day, index) => (
                          <WrapItem key={index}>
                            <Badge colorScheme="teal" rounded="full" px={2}>
                              {day}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </VStack>
                </CardBody>
                <Divider borderColor="gray.200" />
                <CardFooter py={3} bg="gray.50">
                  <Button
                    w="full"
                    colorScheme="teal"
                    leftIcon={<FiEdit />}
                    onClick={() => handleEditDoctor(doctor.uid)}
                  >
                    Edit Doctor
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

export default ListDoctors;