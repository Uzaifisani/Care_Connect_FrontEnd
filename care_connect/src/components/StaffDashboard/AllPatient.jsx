import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GetAllPatients, ListAllDoctors, BookAppointment } from '../../apis';
import { FiSearch, FiCalendar, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const AllPatient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Fetch all patients
  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: GetAllPatients
  });

  // Fetch all doctors
  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: ListAllDoctors
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: (appointmentData) => BookAppointment(appointmentData),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "Appointment Booked",
          description: "Appointment booked successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Booking Failed",
          description: response.data.msg || "Failed to book appointment",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.response?.data?.msg || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const handleScheduleAppointment = (patient) => {
    setSelectedPatient(patient);
    onOpen();
  };

  const handleBookAppointment = () => {
    const doctor = doctors.data.find(doc => doc.uid === selectedDoctor);
    if (!selectedPatient || !doctor || !selectedDate || !selectedTime) {
      toast({
        title: "Invalid Data",
        description: "Please fill all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const appointmentData = {
      FormData: {
        patid: selectedPatient.uid,
        docid: doctor.uid,
        patname: `${selectedPatient.fname} ${selectedPatient.lname}`,
        docname: `Dr. ${doctor.fname} ${doctor.lname}`,
        speciality: doctor.speciality,
        doa: selectedDate,
        date: selectedDate,
        time: selectedTime,
        fee: doctor.fee || 500
      }
    };

    bookAppointmentMutation.mutate(appointmentData);
  };

  // Filter and pagination logic
  const filteredPatients = patients?.data?.filter(patient =>
    patient.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Time slots generation
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

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center" bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="lg">All Patients</Heading>
          <Button onClick={() => navigate('/dashboard')} colorScheme="teal" size="sm">
            Back to Dashboard
          </Button>
        </Flex>

        {/* Search */}
        <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>

        {/* Patients Table */}
        <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedPatients.map((patient) => (
                <Tr key={patient.uid}>
                  <Td>{`${patient.fname} ${patient.lname}`}</Td>
                  <Td>{patient.email}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      leftIcon={<FiCalendar />}
                      onClick={() => handleScheduleAppointment(patient)}
                    >
                      Schedule Appointment
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredPatients.length === 0 && (
            <Text textAlign="center" py={4} color="gray.500">
              No patients found
            </Text>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="center" gap={2} mt={4}>
            <Button
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text alignSelf="center">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Flex>
        )}
      </VStack>

      {/* Appointment Scheduling Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Select Doctor</FormLabel>
                <Select
                  placeholder="Choose a doctor"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  {doctors?.data?.map(doctor => (
                    <option key={doctor.uid} value={doctor.uid}>
                      Dr. {doctor.fname} {doctor.lname} - {doctor.speciality}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Select Date</FormLabel>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Select Time</FormLabel>
                <Select
                  placeholder="Choose time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {getTimeSlots().map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleBookAppointment}
              isLoading={bookAppointmentMutation.isPending}
            >
              Book Appointment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AllPatient;
