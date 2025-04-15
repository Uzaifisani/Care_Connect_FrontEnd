import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Text,
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
  Icon,
  Center,
  useToast,
  Link
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { DoctorsViewPresc } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const ViewPrescriptions = () => {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const toast = useToast();
  
  const {
    data: prescriptions,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['doctorPrescriptions', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User ID not found');
      const response = await DoctorsViewPresc({ docid: user.uid });
      return response.data;
    },
    enabled: !!user?.uid
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  
  // Format date to more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleDownload = (fileUrl, patientName) => {
    // Open the file URL in a new tab
    window.open(fileUrl, '_blank');
    
    toast({
      title: "Downloading Prescription",
      description: `Prescription for ${patientName} is being downloaded`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const renderEmptyState = () => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        No prescriptions found
      </Text>
      <Text color="gray.400" mt={2}>
        You haven't prescribed any medicines yet
      </Text>
    </Center>
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" h="100vh" direction="column">
        <Text color="red.500" fontSize="lg">Error loading prescriptions</Text>
        <Text color="red.400" fontSize="md">{error?.message || "Please try again later"}</Text>
        <Button 
          mt={4} 
          colorScheme="teal" 
          onClick={() => navigate('/dashboard')}
          leftIcon={<FiArrowLeft />}
        >
          Back to Dashboard
        </Button>
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
        borderRadius="lg"
      >
        <Heading as="h1" size="lg" letterSpacing="tight">
          View Prescriptions
        </Heading>
        
        <Button 
          onClick={() => navigate('/dashboard')}
          size="sm"
          colorScheme="teal"
          leftIcon={<FiArrowLeft />}
        >
          Back to Dashboard
        </Button>
      </Flex>

      {!prescriptions || prescriptions.length === 0 ? (
        renderEmptyState()
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {prescriptions.map((prescription) => (
            <Card 
              key={prescription._id} 
              bg={cardBgColor}
              boxShadow="md"
              borderRadius="lg"
              overflow="hidden"
              transition="transform 0.3s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
            >
              <CardHeader bg={cardHeaderBg} py={4}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="teal.600">
                    {prescription.patname || "Unknown Patient"}
                  </Heading>
                  <Badge colorScheme="green">Prescribed</Badge>
                </Flex>
              </CardHeader>
              
              <CardBody py={4}>
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Icon as={FiUser} color="teal.500" />
                    <Text fontWeight="medium">Patient:</Text>
                    <Text>{prescription.patname || "Unknown"}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiCalendar} color="teal.500" />
                    <Text fontWeight="medium">Date:</Text>
                    <Text>{formatDate(prescription.pdate)}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiClock} color="teal.500" />
                    <Text fontWeight="medium">Appointment ID:</Text>
                    <Text>{prescription.aptid}</Text>
                  </HStack>
                </VStack>
              </CardBody>
              
              <Divider />
              
              <CardFooter py={3} justifyContent="center">
                <Button 
                  colorScheme="teal" 
                  size="sm"
                  width="full"
                  leftIcon={<FiDownload />}
                  onClick={() => handleDownload(prescription.file, prescription.patname || "Unknown Patient")}
                >
                  Download Prescription
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ViewPrescriptions;