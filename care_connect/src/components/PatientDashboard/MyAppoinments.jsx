import React from 'react';
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
  useToast
} from '@chakra-ui/react';
import { FiArrowLeft, FiCalendar, FiClock, FiDollarSign, FiUser, FiXCircle } from 'react-icons/fi';
import { MyAppointments, CancelAppointments } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const toast = useToast();

  const {
    data: appointments,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['myAppointments', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User ID not found');
      const response = await MyAppointments({ patid: user.uid });
      return response.data;
    },
    enabled: !!user?.uid
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: (aptid) => CancelAppointments({ aptid }),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "Appointment Cancelled",
          description: "Appointment cancelled successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Cancellation Failed",
          description: response.data.msg || "Failed to cancel appointment",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Cancellation Failed",
        description: error.response?.data?.msg || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  
  const renderEmptyState = () => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        No appointments found
      </Text>
      <Text color="gray.400" mt={2}>
        You have not booked any appointments yet
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
          My Appointments
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
                  <Badge colorScheme={appointment.completed ? "green" : appointment.cancel ? "red" : "blue"}>
                    {appointment.completed ? "Completed" : appointment.cancel ? "Cancelled" : "Upcoming"}
                  </Badge>
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
                    <Icon as={FiClock} color="teal.500" />
                    <Text fontWeight="medium">Time:</Text>
                    <Text>{appointment.time}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiUser} color="teal.500" />
                    <Text fontWeight="medium">Speciality:</Text>
                    <Text>{appointment.speciality}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiDollarSign} color="teal.500" />
                    <Text fontWeight="medium">Fee:</Text>
                    <Text>₹{appointment.fee}</Text>
                  </HStack>
                </VStack>
              </CardBody>

              {!appointment.completed && !appointment.cancel && (
                <Button 
                  colorScheme="red" 
                  leftIcon={<FiXCircle />}
                  onClick={() => cancelAppointmentMutation.mutate(appointment.aptid)}
                  isLoading={cancelAppointmentMutation.isLoading}
                  m={4}
                >
                  Cancel Appointment
                </Button>
              )}
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default MyAppointmentsPage;