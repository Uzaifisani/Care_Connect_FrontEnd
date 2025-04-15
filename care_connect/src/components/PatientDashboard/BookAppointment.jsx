import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Avatar,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center
} from '@chakra-ui/react';
import { FiCalendar, FiArrowLeft, FiClock, FiDollarSign, FiUser, FiCheck } from 'react-icons/fi';
import { FaHospital, FaUserMd } from 'react-icons/fa';
import { ListAllDoctors, BookAppointment } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const BookAppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const toast = useToast();
  
  // Get current day name for filtering
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };
  
  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);
  
  // Fetch all doctors
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
  
  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: (appointmentData) => BookAppointment(appointmentData),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "Appointment Booked",
          description: "Appointment booked successfully. Please proceed to staff for payment.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Booking Failed",
          description: response.data.msg || "Failed to book appointment",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.response?.data?.msg || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
// Filter doctors based on selected date
const getAvailableDoctors = () => {
    if (!doctors || !selectedDate) return [];
    
    const dayName = getDayName(selectedDate);
    
    return doctors.filter(doctor => {
      // Check if doctor works on the selected day
      return doctor.workDays && doctor.workDays.includes(dayName);
    });
  };
  // Time slots generation for the modal
  const getTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const hourText = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      
      slots.push(`${hourText}:00 ${amPm}`);
      slots.push(`${hourText}:30 ${amPm}`);
    }
    
    return slots;
  };
  
  // Handle booking confirmation
  const handleBookAppointment = () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Invalid Data",
        description: "Please make sure all fields are filled",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const appointmentData = { 
      FormData: {
        patid: user.uid,
        docid: selectedDoctor.uid,
        patname: `${user.fname || ''} ${user.lname || ''}` || user.email,
        docname: `Dr. ${selectedDoctor.fname} ${selectedDoctor.lname}`,
        speciality: selectedDoctor.speciality,
        doa: selectedDate,
        date: selectedDate,
        time: selectedTime,
        fee: selectedDoctor.fee || 500
      }
    };
    console.log(appointmentData);
    bookAppointmentMutation.mutate(appointmentData);
    onClose();
  };
  
  // Open booking modal
  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    onOpen();
  };
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('teal.50', 'teal.900');
  
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
        <Text color="red.500" fontSize="lg">Error loading doctors</Text>
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
  
  const availableDoctors = getAvailableDoctors();
  
  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      {/* Header */}
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
          Book Appointment
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
      
      {/* Date Selection */}
      <Box mb={8} p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
        <FormControl>
          <FormLabel>Select Appointment Date</FormLabel>
          <HStack>
            <Input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              max={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]} // Allow booking 3 months ahead
              w="250px"
            />
            <Badge colorScheme="teal" p={2} fontSize="sm">
              {selectedDate ? `${getDayName(selectedDate)}` : 'Select a date'}
            </Badge>
          </HStack>
        </FormControl>
      </Box>
      
      {/* Doctor List */}
      {availableDoctors.length === 0 ? (
        <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md">
          <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
          <Heading size="md" mb={2} textAlign="center">No Doctors Available</Heading>
          <Text color="gray.500" textAlign="center">
            {selectedDate 
              ? `No doctors are available on ${getDayName(selectedDate)}. Please try another date.`
              : 'Please select a date to see available doctors.'}
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {availableDoctors.map((doctor) => (
            <Card 
              key={doctor.uid} 
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
                    Dr. {doctor.fname} {doctor.lname}
                  </Heading>
                  <Badge colorScheme="green">Available</Badge>
                </Flex>
              </CardHeader>
              
              <CardBody py={4}>
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Icon as={FaUserMd} color="teal.500" />
                    <Text fontWeight="medium">Speciality:</Text>
                    <Text>{doctor.speciality}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiDollarSign} color="teal.500" />
                    <Text fontWeight="medium">Fee:</Text>
                    <Text>₹{doctor.fee || 500}</Text>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiCalendar} color="teal.500" />
                    <Text fontWeight="medium">Works on:</Text>
                    <Text>{doctor.workdays ? doctor.workdays.join(', ') : 'Weekdays'}</Text>
                  </HStack>
                  
                  {doctor.experience && (
                    <HStack>
                      <Icon as={FiUser} color="teal.500" />
                      <Text fontWeight="medium">Experience:</Text>
                      <Text>{doctor.experience} years</Text>
                    </HStack>
                  )}
                </VStack>
              </CardBody>
              
              <CardFooter pt={0}>
                <Button 
                  w="full" 
                  colorScheme="teal"
                  leftIcon={<FiCheck />}
                  onClick={() => openBookingModal(doctor)}
                  isLoading={bookAppointmentMutation.isLoading}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      {/* Time Slot Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Appointment Time</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDoctor && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Doctor:</Text>
                  <Text>Dr. {selectedDoctor.fname} {selectedDoctor.lname}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Select Time:</Text>
                  <Select 
                    placeholder="Choose a time" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    mt={2}
                  >
                    {getTimeSlots().map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </Select>
                </Box>
                
                <Box>
                  <Text fontWeight="bold">Fee:</Text>
                  <Text>₹{selectedDoctor.fee || 500}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleBookAppointment}
              isDisabled={!selectedTime}
              isLoading={bookAppointmentMutation.isLoading}
            >
              Confirm Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookAppointmentPage;