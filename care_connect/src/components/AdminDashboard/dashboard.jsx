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
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { FiLogOut, FiUsers, FiUserCheck, FiClipboard, FiMessageSquare } from 'react-icons/fi'
import { MdOutlineVerifiedUser } from 'react-icons/md'
import setUserDataInStorage from '../../hooks/userDataSet'
import useUserStore from '../../store/userStore'
import { generateStats } from '../../apis'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../store/authStore";

const AdminDashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore(state => state.user)
  const deleteUser = useUserStore(state => state.deleteUser)
  const navigate= useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await setUserDataInStorage()
        const response = await generateStats()
        setStats(response.data)
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
  const statBgColor = useColorModeValue('teal.50', 'teal.900')
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200')
  const buttonTextColor = useColorModeValue('white', 'gray.800')
  
  const iconMap = {
    "Most Rated Doctor(s)": FiUsers,
    "Verified Staffs": FiUserCheck,
    "Verified Doctors": MdOutlineVerifiedUser,
    "Registered Patients": FiUsers,
    "Appointments Fulfilled": FiClipboard,
    "Total Appointment Fees": FiClipboard
  }
  
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
            Care Connect Admin
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
                  name={`${user?.fname} ${user?.lname}`} 
                />
                <Text>{user?.fname} {user?.lname}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/dashboard/change-password')}>
                Change Password
              </MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Box p={8}>
        {/* Stats Section */}
        <Heading mb={6} size="lg">Dashboard Overview</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <Stat
              key={index}
              px={6}
              py={5}
              bg={statBgColor}
              rounded="lg"
              boxShadow="md"
              borderColor="teal.200"
              borderWidth="1px"
            >
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel fontWeight="medium" isTruncated>
                    {stat.subheading}
                  </StatLabel>
                  <StatNumber fontSize="3xl" fontWeight="bold">
                    {stat.heading || "N/A"}
                  </StatNumber>
                </Box>
                <Box
                  my="auto"
                  color="teal.500"
                  alignContent="center"
                >
                  <Icon as={iconMap[stat.subheading] || FiUsers} w={8} h={8} />
                </Box>
              </Flex>
            </Stat>
          ))}
        </SimpleGrid>

        {/* Button Panels */}
        <Heading mb={6} size="md">Management</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiUsers size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/admin/doctors')} 
          >
            List All Doctors
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiUserCheck size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/admin/staffs')}
          >
            List All Staff
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<MdOutlineVerifiedUser size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/admin/verify-users')}
          >
            Verify User
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
            onClick={() => navigate('/dashboard/admin/feedback')}
          >
            Feedback
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default AdminDashboard