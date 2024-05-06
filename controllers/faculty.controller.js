const {
    Faculty, Course, User, UserCredential
  } = require("../models");
  const { Op } = require('sequelize');



  exports.getUnassignedFacultyMember = async (req,res)=>{
    try{
      const users= await User.findAll({
        include: [
          {
            model: UserCredential, 
            include: [Course],
          },
          {
            model: Faculty,
          }
        ],
        where:{
          isDeleted:false,
          role:{
            [Op.not]:['admin','student'],
          },
          '$Faculty.id$': { [Op.is]: null }
        },
        attributes:{exclude:['password']},
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json({users:users})
    }catch(e){
        console.log(e);
    }
  }

  exports.getFaculty = async(req,res)=>{
    try{
      const defaultImage = '/assets/images/ddl-logo.png'
      const superior = await Faculty.findAll({
        include: [
          {
            model: User,
            attributes:{exclude:['password']}
          },
        ],
        where:{
          role:{
            [Op.in]:['President','Vice President','Dean','Head'],
          },
          isCoor:false
        }
      })

      position = {
        "President":'SUC III President',
        "Vice President":'VP, Academic Affairs',
        "Dean":"College of Dean",
        "Head":"Head, Department of Language and Literature"
      }
      const supIndex = []
      const formattedSuperior = []
      Object.keys(position).map((keys,index)=>{
        superior.map((data)=>{
          if(data?.role == keys){
            let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
            let image = data?.User?.image ? data?.User?.image : defaultImage
            let role = position[data?.role] ? position[data?.role] : data?.role
            supIndex.push(data?.id)
            let pid = index !=0 ? supIndex[index-1] : 0
            formattedSuperior.push({name:name,id:data?.id,image:image,role:role,pid:pid})
            return
          }
        })
        delete position[keys]
      })
      

      // const superior = members.map((data,index)=>{
      //   let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
      //   let image = data?.User?.image ? data?.User?.image : defaultImage
      //   let role = position[data?.role] ? position[data?.role] : data?.role
      //   return {name:name,id:data?.id,image:image,role:role}
      // })



      res.status(200).send(
        {members:formattedSuperior}
      )


    }catch(e){
      console.log(e)
    }
  }


  exports.postFaculty =  async (req,res)=>{
    const {userId} = req.body;

    const isAlreadyAssigned = await Faculty.findOne({
      where:{
        userId:userId
      }
    })

    if(isAlreadyAssigned) return res.status(409).json({message:"User already assigned!"})
    
    await Faculty.create(req.body)
    res.status(201).json({message:'Successfully Created!'})
    try{
    }catch(e){
        console.log(e);
    }
}