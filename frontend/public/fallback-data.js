const FALLBACK_DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Emergency Medicine',
  'Oncology',
  'Radiology',
  'Internal Medicine',
  'Surgery',
  'Obstetrics & Gynecology',
  'Psychiatry',
  'Dermatology',
  'Ophthalmology',
  'ENT (Otolaryngology)',
  'Urology',
  'Gastroenterology',
  'Pulmonology',
  'Nephrology',
  'Endocrinology',
  'Rheumatology',
  'Anesthesiology',
  'Pathology',
  'Physical Medicine & Rehabilitation',
  'Hematology'
].map((name, index) => ({
  id: index + 1,
  name,
  description: `${name} services`
}));

const DOCTOR_NAMES_BY_DEPT = {
  'Cardiology': ['Dr. James Mitchell', 'Dr. Sarah Anderson', 'Dr. Michael Chen', 'Dr. Patricia Johnson'],
  'Neurology': ['Dr. David Kumar', 'Dr. Emily Watson', 'Dr. Robert Harrison', 'Dr. Lisa Chen'],
  'Pediatrics': ['Dr. Anna Thompson', 'Dr. Christopher Moore', 'Dr. Jennifer Lee', 'Dr. William Brown'],
  'Orthopedics': ['Dr. Marcus Johnson', 'Dr. Nicole Davis', 'Dr. Steven Taylor', 'Dr. Rachel White'],
  'Emergency Medicine': ['Dr. Kevin Adams', 'Dr. Sophia Rodriguez', 'Dr. Matthew Wilson', 'Dr. Jessica Martinez'],
  'Oncology': ['Dr. Thomas Anderson', 'Dr. Michelle Green', 'Dr. Daniel Clark', 'Dr. Victoria Lewis'],
  'Radiology': ['Dr. Richard Jackson', 'Dr. Amanda Scott', 'Dr. Paul Martin', 'Dr. Laura Hall'],
  'Internal Medicine': ['Dr. Joseph Turner', 'Dr. Karen Phillips', 'Dr. Edward Campbell', 'Dr. Susan Parker'],
  'Surgery': ['Dr. Charles Evans', 'Dr. Diane Edwards', 'Dr. George Collins', 'Dr. Margaret Bennett'],
  'Obstetrics & Gynecology': ['Dr. Henry Morgan', 'Dr. Carol Rogers', 'Dr. Andrew Stewart', 'Dr. Barbara Bell'],
  'Psychiatry': ['Dr. Francis Knight', 'Dr. Dorothy Crawford', 'Dr. Lawrence Simmons', 'Dr. Ruth Cooper'],
  'Dermatology': ['Dr. Martin Richardson', 'Dr. Kathleen Cox', 'Dr. Samuel Howard', 'Dr. Alice Mason'],
  'Ophthalmology': ['Dr. Victor Price', 'Dr. Deborah Graham', 'Dr. Donald Sullivan', 'Dr. Diane Murray'],
  'ENT (Otolaryngology)': ['Dr. Alan Hansen', 'Dr. Megan Sutherland', 'Dr. Stephen Sanders', 'Dr. Helen Boyd'],
  'Urology': ['Dr. Kenneth Palmer', 'Dr. Brenda Palmer', 'Dr. Jerry Rice', 'Dr. Nancy Stone'],
  'Gastroenterology': ['Dr. Dennis Shaw', 'Dr. Carolyn Holmes', 'Dr. Gary Summers', 'Dr. Evelyn Bryant'],
  'Pulmonology': ['Dr. Brian Ross', 'Dr. Gloria Rivers', 'Dr. Ronald Knight', 'Dr. Janice Gardner'],
  'Nephrology': ['Dr. Harold Stone', 'Dr. Rose Steele', 'Dr. Ralph Cross', 'Dr. Dorothy Jenkins'],
  'Endocrinology': ['Dr. Roy Fletcher', 'Dr. Norma Perry', 'Dr. Russell Howell', 'Dr. Jean Powell'],
  'Rheumatology': ['Dr. Eugene Graves', 'Dr. Willie Long', 'Dr. Arthur Frazier', 'Dr. Janet Barton'],
  'Anesthesiology': ['Dr. Harry Grant', 'Dr. Betty Hicks', 'Dr. Fred Lucas', 'Dr. Mildred Caldwell'],
  'Pathology': ['Dr. Terry Crawford', 'Dr. Shirley Owens', 'Dr. Gary Baker', 'Dr. Dorothy Merrill'],
  'Physical Medicine & Rehabilitation': ['Dr. Jerry Kelley', 'Dr. Stella Carr', 'Dr. Joe Drake', 'Dr. Tina Summers'],
  'Hematology': ['Dr. Billy Douglas', 'Dr. Constance Mason', 'Dr. Bobby Hardy', 'Dr. Doris Moses']
};

const FALLBACK_DOCTORS = FALLBACK_DEPARTMENTS.flatMap((department) => {
  const deptNames = DOCTOR_NAMES_BY_DEPT[department.name] || [
    'Dr. James Smith',
    'Dr. Sarah Johnson',
    'Dr. Michael Brown',
    'Dr. Emily Davis'
  ];

  return deptNames.map((fullName, idx) => {
    const doctorId = (department.id - 1) * 4 + idx + 1;
    return {
      id: doctorId,
      full_name: fullName,
      specialization: `${department.name} Specialist`,
      availability: 'Mon-Fri, 9:00 AM - 5:00 PM',
      is_active: true,
      department_id: department.id,
      department: {
        id: department.id,
        name: department.name,
        description: department.description
      }
    };
  });
});

window.PUBLIC_FALLBACK_DEPARTMENTS = FALLBACK_DEPARTMENTS;
window.PUBLIC_FALLBACK_DOCTORS = FALLBACK_DOCTORS;
