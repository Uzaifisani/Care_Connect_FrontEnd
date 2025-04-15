import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  Badge,
  Textarea,
  useToast,
  Input
} from '@chakra-ui/react';
import { FiArrowLeft, FiCalendar, FiStar, FiUser } from 'react-icons/fi';
import { MyAppointments, WriteFeedbacks } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const GiveFeedbackPage = () => {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const toast = useToast();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const {
    data: appointments,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['completedAppointments', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User ID not found');
      const response = await MyAppointments({ patid: user.uid });
      return response.data.filter(appointment => appointment.completed);
    },
    enabled: !!user?.uid
  });

  const feedbackMutation = useMutation({
    mutationFn: (feedbackData) => WriteFeedbacks(feedbackData),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "Feedback Submitted",
          description: "Your feedback has been submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Submission Failed",
          description: response.data.msg || "Failed to submit feedback",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.msg || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });

  const handleFeedbackSubmit = (aptid) => {
    if (!review || rating === 0) {
      toast({
        title: "Incomplete Feedback",
        description: "Please provide both a review and a rating.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    feedbackMutation.mutate({ aptid, review, rating });
  };

  const handleFeedbackDelete = (aptid) => {
    feedbackMutation.mutate({ aptid, feedback: false });
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  
  const renderEmptyState = () => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        No completed appointments found
      </Text>
      <Text color="gray.400" mt={2}>
        You have no completed appointments to give feedback on.
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
        <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          Error loading appointments
        </Text>
        <Text color="gray.400" mt={2}>
          {error?.message || "Please try again later"}
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
          Give Feedback
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

      {appointments.length === 0 ? (
        renderEmptyState()
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {appointments.map((appointment) => (
            <Card 
              key={appointment._id} 
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
                    {appointment.docname}
                  </Heading>
                  <Badge colorScheme="green">Completed</Badge>
                </Flex>
              </CardHeader>
              
              <CardBody py={4}>
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Icon as={FiCalendar} color="teal.500" />
                    <Text fontWeight="medium">Date:</Text>
                    <Text>{new Date(appointment.date).toLocaleDateString()}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiUser} color="teal.500" />
                    <Text fontWeight="medium">Speciality:</Text>
                    <Text>{appointment.speciality}</Text>
                  </HStack>

                  {appointment.feedback ? (
                    <>
                      <Text fontWeight="medium">Review:</Text>
                      <Text>{appointment.review}</Text>
                      <Text fontWeight="medium">Rating:</Text>
                      <Text>{appointment.rating} / 5</Text>
                    </>
                  ) : (
                    <>
                      <Textarea
                        placeholder="Write your review here..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        mb={3}
                      />

                      <HStack>
                        <Text fontWeight="medium">Rating:</Text>
                        <Input
                          type="number"
                          max={5}
                          min={1}
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          width="60px"
                        />
                        <Icon as={FiStar} color="teal.500" />
                      </HStack>
                    </>
                  )}
                </VStack>
              </CardBody>

              {!appointment.feedback && (
                <Button 
                  colorScheme="teal" 
                  onClick={() => handleFeedbackSubmit(appointment.aptid)}
                  m={4}
                >
                  Submit Feedback
                </Button>
              )}

              <Button 
                colorScheme="red" 
                onClick={() => handleFeedbackDelete(appointment.aptid)}
                m={4}
              >
                Delete Feedback
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default GiveFeedbackPage;