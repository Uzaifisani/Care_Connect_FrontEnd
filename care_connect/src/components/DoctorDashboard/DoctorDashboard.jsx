import React, { useEffect, useState } from 'react'
import {
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Avatar, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Icon,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { FiLogOut, FiCalendar, FiFileText, FiMessageSquare, FiClipboard } from 'react-icons/fi'
import setUserDataInStorage from '../../hooks/userDataSet'
import useUserStore from '../../store/userStore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../store/authStore";

const DoctorDashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore(state => state.user)
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await setUserDataInStorage()
        // You can add doctor-specific stats fetching here if needed
        // Example: const response = await generateDoctorStats()
        // setStats(response.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeDashboard()
  }, [])
  
  const handleLogout = () => {
    logout();
    navigate('/');
  }
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200')
  const buttonTextColor = useColorModeValue('white', 'gray.800')
  
  if (loading || !user) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Loading dashboard...</Text>
      </Flex>
    )
  }
  
  return (
    <Box minH="100vh" bg="gray.100">
      {/* Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={bgColor}
        color="teal.500"
        boxShadow="md"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing="tight">
            Hello, Doctor
          </Heading>
        </Flex>

        <Flex align="center">
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <HStack>
                <Avatar 
                  size="sm" 
                  name={`${user?.email}`} 
                />
                <Text>{user?.email}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Box p={8}>
        {/* Button Panels */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiCalendar size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/appointments')} 
          >
            Appointments
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiFileText size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/upload-prescription')}
          >
            Upload Prescription
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiMessageSquare size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/feedbacks')}
          >
            Feedbacks
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiClipboard size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/view-prescriptions')}
          >
            View Prescriptions
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default DoctorDashboard