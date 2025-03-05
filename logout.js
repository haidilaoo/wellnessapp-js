import { getAuth, signOut } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';

const logout = async (navigation) => {
  try {
    const auth = getAuth(); // Initialize auth
    await signOut(auth); // Sign out the user
    console.log('User logged out');
    
    // Reset navigation after logout
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthFlow' }], // Replace with your actual login screen
      })
    );
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
};

export { logout };
