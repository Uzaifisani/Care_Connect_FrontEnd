import React from 'react';
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
  Icon,
  Center,
  Badge
} from '@chakra-ui/react';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { DoctorsFeedback } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const DFeedback = () => {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  
  const {
    data: feedbacks,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['doctorFeedbacks', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User ID not found');
      const response = await DoctorsFeedback({ docid: user.uid });
      
      // Check if API returned an error
      if (response.data.error) {
        throw new Error(response.data.errorMsg);
      }
      
      return response.data;
    },
    enabled: !!user?.uid
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  const starColor = useColorModeValue('yellow.400', 'yellow.300');
  
  // Format date to more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <HStack spacing={1}>
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            as={i < rating ? FaStar : FaRegStar} 
            color={i < rating ? starColor : 'gray.300'} 
            w={4} 
            h={4} 
          />
        ))}
      </HStack>
    );
  };
  
  const renderEmptyState = () => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiMessageSquare} w={16} h={16} color="gray.300" mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        No feedback found
      </Text>
      <Text color="gray.400" mt={2}>
        You have not received any feedback from patients yet
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
      <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
        <Icon as={FiMessageSquare} w={16} h={16} color="gray.300" mb={4} />
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          No feedback found
        </Text>
        <Text color="gray.400" mt={2}>
          {error?.message || "You have not received any feedback from patients yet"}
        </Text>
        <Button 
          mt={6} 
          colorScheme="teal" 
          onClick={() => navigate('/dashboard')}
          leftIcon={<FiArrowLeft />}
        >
          Back to Dashboard
        </Button>
      </Center>
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
          Patient Feedback
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

      {feedbacks.length === 0 ? (
        renderEmptyState()
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {feedbacks.map((feedback, index) => (
            <Card 
              key={index} 
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
                    {feedback.patname}
                  </Heading>
                  <Badge colorScheme="purple">Feedback</Badge>
                </Flex>
              </CardHeader>
              
              <CardBody py={4}>
                <VStack align="stretch" spacing={4}>
                  <HStack>
                    <Text fontWeight="medium">Date:</Text>
                    <Text>{formatDate(feedback.date)}</Text>
                  </HStack>
                  
                  <VStack align="start">
                    <Text fontWeight="medium">Rating:</Text>
                    {renderStars(feedback.rating)}
                  </VStack>
                  
                  <VStack align="start">
                    <Text fontWeight="medium">Review:</Text>
                    <Box 
                      p={3} 
                      bg="gray.50" 
                      borderRadius="md" 
                      borderLeft="4px solid" 
                      borderColor="teal.400"
                      width="100%"
                    >
                      <Text fontStyle="italic">"{feedback.review}"</Text>
                    </Box>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default DFeedback;