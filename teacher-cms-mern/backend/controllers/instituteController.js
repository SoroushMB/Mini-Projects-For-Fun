const Institute = require('../models/Institute');
const InstituteStaff = require('../models/InstituteStaff');
const User = require('../models/User');
const Class = require('../models/Class');

exports.createInstitute = async (req, res) => {
  try {
    const { name, description, website, logo } = req.body;

    const existingInstitute = await Institute.findOne({ owner: req.user.id });
    if (existingInstitute) {
      return res.status(400).json({ success: false, message: 'You already have an institute' });
    }

    const institute = await Institute.create({
      owner: req.user.id,
      name,
      description,
      website,
      logo
    });

    await User.findByIdAndUpdate(req.user.id, { role: 'institute_owner' });

    res.status(201).json({
      success: true,
      data: institute
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyInstitute = async (req, res) => {
  try {
    let institute;
    
    if (req.user.role === 'institute_owner') {
      institute = await Institute.findOne({ owner: req.user.id }).populate('owner', 'name email');
    } else {
      const staff = await InstituteStaff.findOne({ user: req.user.id, isActive: true });
      if (staff) {
        institute = await Institute.findById(staff.institute).populate('owner', 'name email');
      }
    }

    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    const staff = await InstituteStaff.find({ institute: institute._id, isActive: true })
      .populate('user', 'name email role');

    const classes = await Class.find({ institute: institute._id })
      .populate('teacher', 'name email');

    res.status(200).json({
      success: true,
      data: {
        institute,
        staff,
        classes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInstitute = async (req, res) => {
  try {
    const institute = await Institute.findOne({ owner: req.user.id });

    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    const updated = await Institute.findByIdAndUpdate(
      institute._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.hireStaff = async (req, res) => {
  try {
    const { email, role } = req.body;

    const institute = await Institute.findOne({ owner: req.user.id });
    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    if (!['teacher', 'secretary', 'consultant'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please ask them to register first.' 
      });
    }

    const existingStaff = await InstituteStaff.findOne({
      institute: institute._id,
      user: user._id
    });

    if (existingStaff) {
      if (existingStaff.isActive) {
        return res.status(400).json({ success: false, message: 'User is already on staff' });
      } else {
        existingStaff.isActive = true;
        existingStaff.role = role;
        await existingStaff.save();
        
        await User.findByIdAndUpdate(user._id, { role });

        return res.status(200).json({
          success: true,
          data: existingStaff
        });
      }
    }

    const staff = await InstituteStaff.create({
      institute: institute._id,
      user: user._id,
      role
    });

    await User.findByIdAndUpdate(user._id, { role });

    res.status(201).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const institute = await Institute.findOne({ owner: req.user.id });
    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    const staff = await InstituteStaff.find({ institute: institute._id })
      .populate('user', 'name email phone bio avatar')
      .sort('-hiredAt');

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeStaff = async (req, res) => {
  try {
    const institute = await Institute.findOne({ owner: req.user.id });
    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    const staff = await InstituteStaff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    if (staff.institute.toString() !== institute._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    staff.isActive = false;
    await staff.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
