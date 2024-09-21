import { supabase } from './supabaseClient';

// Define other default profile fields
const otherDefaultProfileFields = {
  academic_program: '',
  skills: '',
  profile_image: '',
  gender: '',
  nationality: '',
  availability: '',
  interests: '',
  work_preference: '',
  student_id: '',
  gpa: '',
  // Add any other default fields for the profile here
};

// Check if the user profile exists, if not, create it
export const checkOrCreateUserProfile = async (userId: string) => {
  // Fetch the user profile from the `profiles` table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile does not exist, create a new one
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: userId, name: '', bio: '', ...otherDefaultProfileFields }]);

    if (insertError) {
      console.error('Error creating user profile:', insertError);
    } else {
      console.log('New profile created');
    }
  } else if (error) {
    console.error('Error fetching profile:', error);
  }

  return profile;
};
