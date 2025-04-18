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
  Input,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  useToast
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { GetPrescription } from '../../apis';
import { FiSearch, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const ITEMS_PER_PAGE = 10;

const ViewPrescription = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Fetch prescriptions
  const { data: prescriptions, isLoading, isError, error } = useQuery({
    queryKey: ['prescriptions', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User ID not found');
      const response = await GetPrescription({ patid: user.uid });
      return response.data;
    },
    enabled: !!user?.uid
  });

  // Handle prescription download
  const handleDownload = (url, docname, date) => {
    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      // Format filename: DoctorName_Date_Prescription.pdf
      const fileName = `${docname.replace(/\s+/g, '_')}_${date.replace(/,|\s+/g, '_')}_Prescription.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your prescription download has started",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download prescription. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filter prescriptions based on search term and date
  const filteredPrescriptions = prescriptions?.filter(prescription => {
    const matchesSearch = prescription.docname.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Convert API date to comparable format
    if (dateFilter) {
      const prescDate = new Date(prescription.pdate);
      const filterDate = new Date(dateFilter);
      
      // Compare year, month, and day only
      return matchesSearch && 
        prescDate.getFullYear() === filterDate.getFullYear() &&
        prescDate.getMonth() === filterDate.getMonth() &&
        prescDate.getDate() === filterDate.getDate();
    }
    
    return matchesSearch;
  }) || [];

  const totalPages = Math.ceil(filteredPrescriptions.length / ITEMS_PER_PAGE);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Loading state
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box p={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Text>Error loading prescriptions: {error?.message || "Please try again"}</Text>
        </Alert>
        <Button mt={4} onClick={() => navigate('/dashboard')} colorScheme="teal">
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center" bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="lg">My Prescriptions</Heading>
          <Button 
            onClick={() => navigate('/dashboard')} 
            colorScheme="teal" 
            size="sm"
            leftIcon={<FiArrowLeft />}
          >
            Back to Dashboard
          </Button>
        </Flex>

        {/* Search and Filter */}
        <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
          <HStack spacing={4}>
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by doctor name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Box>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
                w="200px"
              />
            </Box>
            {dateFilter && (
              <Button
                size="sm"
                colorScheme="gray"
                onClick={() => setDateFilter('')}
              >
                Clear Date
              </Button>
            )}
          </HStack>
        </Box>

        {/* Prescriptions Table */}
        <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Doctor Name</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedPrescriptions.map((prescription) => (
                <Tr key={prescription._id}>
                  <Td>{prescription.docname}</Td>
                  <Td>{prescription.pdate}</Td>
                  <Td>{prescription.prescribed ? "Available" : "Pending"}</Td>
                  <Td>
                    {prescription.prescribed && (
                      <Button
                        colorScheme="teal"
                        size="sm"
                        leftIcon={<FiDownload />}
                        onClick={() => handleDownload(prescription.file, prescription.docname, prescription.pdate)}
                      >
                        Download
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredPrescriptions.length === 0 && (
            <Text textAlign="center" py={4} color="gray.500">
              No prescriptions found
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
    </Box>
  );
};

export default ViewPrescription;
