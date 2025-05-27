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
  SimpleGrid,
  Spinner,
  useColorModeValue,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Icon,
  Badge,
  Center,
  Image
} from '@chakra-ui/react';
import { FiSearch, FiMessageCircle } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { getAllFeedbacks } from '../../apis';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const {
    data: feedbacks,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const response = await getAllFeedbacks();
      return response.data;
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  const starColor = useColorModeValue('yellow.400', 'yellow.300');
  const emptyStateColor = useColorModeValue('gray.200', 'gray.600');

  // Filter feedbacks based on search term (patient or doctor name)
  const filteredFeedbacks = feedbacks?.filter(feedback => 
    feedback.patname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    feedback.docname.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const renderEmptyState = (message) => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiMessageCircle} w={16} h={16} color={emptyStateColor} mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        {message}
      </Text>
      {searchTerm && (
        <Button 
          mt={4} 
          colorScheme="teal" 
          size="sm"
          onClick={() => setSearchTerm('')}
        >
          Clear Search
        </Button>
      )}
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
        <Icon as={FiMessageCircle} w={16} h={16} color="red.500" mb={4} />
        <Text color="red.500" fontSize="lg">No Feedback Found</Text>
        <Text color="red.400" fontSize="md">{"Please try again later"}</Text>
        <Button 
          mt={4} 
          colorScheme="red" 
          onClick={() => navigate('/dashboard')}
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
      >
        <Heading as="h1" size="lg" letterSpacing="tight">
          Patient Feedbacks
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
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: 'teal.300' }}
            _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
          />
        </InputGroup>

        {/* Feedbacks Grid or Empty State */}
        {!feedbacks || feedbacks.length === 0 ? (
          renderEmptyState("No feedback records found in the system")
        ) : filteredFeedbacks.length === 0 ? (
          renderEmptyState(`No feedbacks match your search for "${searchTerm}"`)
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredFeedbacks.map((feedback, index) => (
              <Card 
                key={index} 
                bg={cardBgColor}
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
                borderColor="teal.100"
                borderWidth="1px"
              >
                <CardHeader bg={cardHeaderBg} py={3}>
                  <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={0}>
                      <Heading size="sm" color="teal.600">
                        {feedback.docname}
                      </Heading>
                      <Text fontSize="xs" color="gray.600">
                        Rated by {feedback.patname}
                      </Text>
                    </VStack>
                    <Badge colorScheme="blue" p={1} borderRadius="md">
                      {feedback.date}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody py={4}>
                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontWeight="bold" mb={1}>Rating:</Text>
                      {renderStars(feedback.rating)}
                    </Box>
                    <Box>
                      <Text fontWeight="bold" mb={1}>Review:</Text>
                      <Text>{feedback.review}</Text>
                    </Box>
                  </VStack>
                </CardBody>
                <Divider borderColor="gray.200" />
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default Feedback;