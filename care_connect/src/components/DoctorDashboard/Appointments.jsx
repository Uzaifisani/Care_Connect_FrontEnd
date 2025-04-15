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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Center,
  Select
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiDollarSign, FiUser, FiArrowLeft } from 'react-icons/fi';
import { AppointmentsAPI } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const Appointments = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  
  const {
    data: appointments,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['doctorAppointments', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User ID not found');
      const response = await AppointmentsAPI({ docid: user.uid });
      if (response.error) {
        throw new Error(response.errorMsg || 'No appointments found');
      }
      return response.data;
    },
    enabled: !!user?.uid
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  
  // Filter appointments based on their status
  const getFilteredAppointments = () => {
    if (!appointments) return [];
    
    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => !apt.completed && !apt.cancel);
      case 'completed':
        return appointments.filter(apt => apt.completed);
      case 'cancelled':
        return appointments.filter(apt => apt.cancel);
      default:
        return appointments;
    }
  };
  
  // Get status badge for each appointment
  const getStatusBadge = (appointment) => {
    if (appointment.cancel) {
      return <Badge colorScheme="red">Cancelled</Badge>;
    } else if (appointment.completed) {
      return <Badge colorScheme="green">Completed</Badge>;
    } else {
      return <Badge colorScheme="blue">Upcoming</Badge>;
    }
  };
  
  // Format date to more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const renderEmptyState = () => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        No appointments found
      </Text>
      <Text color="gray.400" mt={2} mb={4}>
        There are no appointments that match your filter criteria
      </Text>
      <Button 
        colorScheme="teal" 
        leftIcon={<FiArrowLeft />}
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
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
        <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
        <Text color="gray.500" fontSize="xl" fontWeight="bold">
          { "No appointments found"}
        </Text>
        <Text color="gray.400" mt={2} mb={4}>
          You don't have any appointments scheduled at the moment
        </Text>
        <Button 
          colorScheme="teal" 
          leftIcon={<FiArrowLeft />}
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

      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" mb={8}>
        <HStack spacing={4}>
          <Text fontWeight="bold">Filter by:</Text>
          <Select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            w="200px"
            bg="white"
          >
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </HStack>
      </Box>

      {getFilteredAppointments().length === 0 ? (
        renderEmptyState()
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {getFilteredAppointments().map((appointment) => (
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
                    {appointment.patname}
                  </Heading>
                  {getStatusBadge(appointment)}
                </Flex>
              </CardHeader>
              
              <CardBody py={4}>
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Icon as={FiCalendar} color="teal.500" />
                    <Text fontWeight="medium">Date:</Text>
                    <Text>{formatDate(appointment.date)}</Text>
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
              
              <Divider />
              
              <CardFooter py={3} justifyContent="center">
                {!appointment.completed && !appointment.cancel ? (
                  <Button 
                    colorScheme="teal" 
                    size="sm"
                    width="full"
                  >
                    Mark Complete
                  </Button>
                ) : (
                  appointment.feedback ? (
                    <Badge colorScheme="purple" p={2} borderRadius="md">
                      Has Feedback • Rating: {appointment.rating}/5
                    </Badge>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      {appointment.completed ? "No feedback yet" : "Appointment cancelled"}
                    </Text>
                  )
                )}
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Appointments;