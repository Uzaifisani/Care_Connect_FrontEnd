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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  useToast,
  Icon,
  Center,
  Select,
  Input,
  IconButton 
} from '@chakra-ui/react';
import { AppointmentsAPI, DoctorsUploadPresc } from '../../apis';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import { FiCalendar, FiClock, FiDollarSign, FiUser, FiArrowLeft, FiFileText, FiPlus, FiTrash2 } from 'react-icons/fi';

const UploadPrescriptions = () => {
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const toast = useToast();
  const [medicines, setMedicines] = useState([
    { medicine: '', dose: '', tip: '' }
  ]);
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
  
  const handlePrescribe = (appointment) => {
    setSelectedAppointment(appointment);
    setMedicines([{ medicine: '', dose: '', tip: '' }]); // Reset medicines when opening modal
    onOpen();
  };
  const addMedicine = () => {
    setMedicines([...medicines, { medicine: '', dose: '', tip: '' }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };
  
  const handleSubmitPrescription = async () => {
    // Validate if all medicine fields are filled
    const isValid = medicines.every(med => 
      med.medicine.trim() && med.dose.trim() && med.tip.trim()
    );

    if (!isValid) {
      toast({
        title: "Error",
        description: "Please fill all medicine details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const prescriptionData = {
        aptid: selectedAppointment._id,
        patid: selectedAppointment.patid,
        docid: user.uid,
        patname: selectedAppointment.patname,
        docname: `Dr. ${user.fname} ${user.lname}`,
        details: medicines
      };
      
      const response = await DoctorsUploadPresc(prescriptionData);
      
      if (response.data.error === false) {
        toast({
          title: "Success",
          description: response.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: response.data.msg || "Failed to upload prescription",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload prescription",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const renderEmptyState = () => (
    <Center flexDirection="column" p={10} bg={bgColor} borderRadius="lg" boxShadow="md" mt={10}>
      <Icon as={FiCalendar} w={16} h={16} color="gray.300" mb={4} />
      <Text fontSize="xl" fontWeight="bold" color="gray.500">
        No appointments found
      </Text>
      <Text color="gray.400" mt={2}>
        There are no appointments that match your filter criteria
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
        <Text color="red.500" fontSize="lg">no Incomplete Prescriptions Pending...</Text>
        <Text color="red.400" fontSize="md">{ "Please try again later"}</Text>
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
          Upload Prescriptions
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
                {!appointment.cancel ? (
                  <Button 
                    colorScheme="teal" 
                    size="sm"
                    width="full"
                    leftIcon={<FiFileText />}
                    onClick={() => handlePrescribe(appointment)}
                  >
                    Prescribe Medicines
                  </Button>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    Appointment cancelled
                  </Text>
                )}
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Prescription Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prescribe Medicines</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAppointment && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Patient:</Text>
                  <Text>{selectedAppointment.patname}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{formatDate(selectedAppointment.date)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={4}>Medicines:</Text>
                  {medicines.map((med, index) => (
                    <Box 
                      key={index} 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      mb={4}
                      position="relative"
                    >
                      <Flex justify="space-between" align="center" mb={3}>
                        <Text fontWeight="medium">Medicine {index + 1}</Text>
                        {medicines.length > 1 && (
                          <IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeMedicine(index)}
                            aria-label="Remove medicine"
                          />
                        )}
                      </Flex>
                      <SimpleGrid columns={3} spacing={4}>
                        <Box>
                          <Text fontSize="sm" mb={1}>Medicine Name</Text>
                          <Input
                            placeholder="e.g., Paracetamol"
                            value={med.medicine}
                            onChange={(e) => handleMedicineChange(index, 'medicine', e.target.value)}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" mb={1}>Dose</Text>
                          <Input
                            placeholder="e.g., 500mg"
                            value={med.dose}
                            onChange={(e) => handleMedicineChange(index, 'dose', e.target.value)}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" mb={1}>Instructions</Text>
                          <Input
                            placeholder="e.g., After food"
                            value={med.tip}
                            onChange={(e) => handleMedicineChange(index, 'tip', e.target.value)}
                          />
                        </Box>
                      </SimpleGrid>
                    </Box>
                  ))}
                  <Button
                    leftIcon={<FiPlus />}
                    onClick={addMedicine}
                    colorScheme="teal"
                    variant="outline"
                    size="sm"
                    w="full"
                  >
                    Add More Medicine
                  </Button>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSubmitPrescription}>
              Submit Prescription
            </Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
    </Box>
  );
};

export default UploadPrescriptions;