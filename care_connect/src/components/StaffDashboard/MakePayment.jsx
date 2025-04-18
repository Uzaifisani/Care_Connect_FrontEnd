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
  Select,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientwithIncompletePayment, AcceptPayment } from '../../apis';
import { FiSearch, FiDollarSign } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const MakePayment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState({}); // Track payment methods per patient
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Updated query with error handling and proper response structure
  const { data: pendingPayments, isLoading, isError, error } = useQuery({
    queryKey: ['pendingPayments'],
    queryFn: async () => {
      try {
        const response = await PatientwithIncompletePayment();
        console.log('API Response:', response); // Debug log
        return response.data;
      } catch (error) {
        console.error('API Error:', error); // Debug log
        throw error;
      }
    },
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });

  const acceptPaymentMutation = useMutation({
    mutationFn: (paymentData) => AcceptPayment(paymentData),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.data.message || "Payment accepted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['pendingPayments']);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to accept payment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const handlePaymentMethodChange = (aptid, method) => {
    setPaymentMethods(prev => ({
      ...prev,
      [aptid]: method
    }));
  };

  const handleAcceptPayment = (aptid) => {
    const paymentMethod = paymentMethods[aptid] || 'cash'; // Default to cash if not set
    acceptPaymentMutation.mutate({
      aptid,
      paymentMethod,
      transactionId: paymentMethod === 'cash' ? '' : Date.now().toString()
    });
  };

  // Filter and pagination logic
  const filteredPayments = pendingPayments?.filter(payment =>
    payment.patname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.docname?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
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
          <Text>Error loading pending payments: {error?.message || "Please try again"}</Text>
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
          <Heading size="lg">Pending Payments</Heading>
          <Button onClick={() => navigate('/dashboard')} colorScheme="teal" size="sm">
            Back to Dashboard
          </Button>
        </Flex>

        {/* Search and Filter */}
        <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by patient or doctor name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>

        {/* Payments Table */}
        <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Patient Name</Th>
                <Th>Doctor Name</Th>
                <Th>Speciality</Th>
                <Th>Appointment Date</Th>
                <Th>Time</Th>
                <Th>Amount</Th>
                <Th>Payment Method</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedPayments.map((payment) => (
                <Tr key={payment.aptid}>
                  <Td>{payment.patname}</Td>
                  <Td>{payment.docname}</Td>
                  <Td>{payment.speciality}</Td>
                  <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                  <Td>{payment.time}</Td>
                  <Td>₹{payment.fee}</Td>
                  <Td>
                    <Select
                      size="sm"
                      value={paymentMethods[payment.aptid] || 'cash'}
                      onChange={(e) => handlePaymentMethodChange(payment.aptid, e.target.value)}
                      width="120px"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                    </Select>
                  </Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      size="sm"
                      leftIcon={<FiDollarSign />}
                      isLoading={acceptPaymentMutation.isPending}
                      onClick={() => handleAcceptPayment(payment.aptid)}
                    >
                      Accept Payment
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredPayments.length === 0 && (
            <Text textAlign="center" py={4} color="gray.500">
              No pending payments found
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

export default MakePayment;
