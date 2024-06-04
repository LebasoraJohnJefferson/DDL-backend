const {
    Faculty, Course, User, UserCredential
  } = require("../models");
  const { Op } = require('sequelize');



  exports.getFaculty = async (req,res)=>{
    try {
        const facultyMembers = await Faculty.findAll({
          include: [
            {
              model: User,
              attributes:{exclude:['password']}
            },
          ],
        })

        const formattedData = facultyMembers.map((data)=>{
          let fullName = `${data?.User?.firstName} ${data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User.lastName} ${data?.User?.suffix ?  data?.User?.suffix : ''}`
          let isCoor = data?.isCoor ? 'Yes' : 'No'
          return {role:data?.role,extension:data?.extension,id:data?.id,fullName:fullName,isCoor:isCoor}
        })


        res.status(200).json({facultyMembers:formattedData})
    } catch (error) {
      console.log(error)
    }
  }


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

  exports.getFacultyChart = async(req,res)=>{
    try{
      let couter = 0
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
        "Head":"Head, Department of Languages and Literatures"
      }
      const supIndex = []
      const formattedSuperior = []
      let headId = null;
      Object.keys(position).map((keys,index)=>{
        superior.map((data)=>{
          if(data?.role == keys){
            let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
            let image = data?.User?.image ? data?.User?.image : defaultImage
            let role = position[data?.role] ? position[data?.role] : data?.role
            supIndex.push(data?.id)
            let pid = index !=0 ? supIndex[index-1] : 0
            if(keys=='Head') headId = data?.id;
            let description = data?.description ? data?.description : null
            formattedSuperior.push({description:description,name:name,id:data?.id,image:image,role:role,pid:pid})
            return
          }
        })
        delete position[keys]
      })


      const coordinators = await Faculty.findAll({
        include: [
          {
            model: User,
            attributes:{exclude:['password']},
            include:[
              {
                model:UserCredential,
                include:[
                  {
                    model:Course
                  }
                ]
              }
            ]
          },
        ],
        where:{
          role:{
            [Op.not]:['President','Vice President','Dean','Head'],
          },
          isCoor:true
        }
      })

      let BSFcoor = []
      let BAELcoor = []

      const formattedCoor = coordinators.map((data)=>{
        let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
        let image = data?.User?.image ? data?.User?.image : defaultImage
        let description = data?.description ? data?.description : null
        if(data?.User?.UserCredential?.Course?.acronym === 'BSF'){
          BSFcoor.push(data?.id)
        }else{
          BAELcoor.push(data?.id)
        }
        return {description:description,name:name,id:data?.id,image:image,role:data?.role,pid:headId,subRole:`${data?.User?.UserCredential?.Course?.acronym} Program Coordinator`}
      })

      const BAELmembers = await Faculty.findAll({
        include: [
          {
            model: User,
            attributes:{exclude:['password']},
            include:[
              {
                model:UserCredential,
                include:[
                  {
                    model:Course,
                  }
                ]
              }
            ]
          },
        ],
        where:{
          '$User.UserCredential.Course.acronym$':'BAEL',
          role:{
            [Op.not]:['President','Vice President','Dean','Head'],
          },
          isCoor:false
        }
      })


      let formattedBAELMember = []
      if(BAELcoor){
        let pid= null
        let count = 0
        let tempCoor = [...BAELcoor,...BAELcoor]
        let replaceCoor = []
        formattedBAELMember =  BAELmembers.map((data)=>{
          if(count >= tempCoor.length){
            tempCoor = replaceCoor
            count=0
          }
          replaceCoor.push(data?.id)
          pid = tempCoor[count]
          count++
          let description = data?.description ? data?.description : null
          let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
          let image = data?.User?.image ? data?.User?.image : defaultImage
          return {description:description,name:name,id:data?.id,image:image,role:data?.role,pid:pid}
        })
      }




      const BSFmembers = await Faculty.findAll({
        include: [
          {
            model: User,
            attributes:{exclude:['password']},
            include:[
              {
                model:UserCredential,
                include:[
                  {
                    model:Course,
                  }
                ]
              }
            ]
          },
        ],
        where:{
          '$User.UserCredential.Course.acronym$':'BSF',
          role:{
            [Op.not]:['President','Vice President','Dean','Head'],
          },
          isCoor:false
        }
      })


      
      let formattedBSFMember = []
      if(BSFcoor){
        let pidBSF= null
        let countBSF = 0
        let tempCoorBSF = [...BSFcoor,...BSFcoor]
        let replaceCoorBSF = []
        formattedBSFMember =  BSFmembers.map((data)=>{
          if(countBSF >= tempCoorBSF.length){
            tempCoorBSF = replaceCoorBSF
            countBSF=0
          }
          replaceCoorBSF.push(data?.id)
          pidBSF = tempCoorBSF[countBSF]
          countBSF++
          let description = data?.description ? data?.description : null
          let nameBSF = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
          let imageBSF = data?.User?.image ? data?.User?.image : defaultImage
          return {description:description,name:nameBSF,id:data?.id,image:imageBSF,role:data?.role,pid:pidBSF}
        })
      }



      const newData = [...formattedSuperior,...formattedCoor,...formattedBAELMember,...formattedBSFMember]

      res.status(200).send(
        {members:newData}
      )


    }catch(e){
      console.log(e)
    }
  }


  exports.postFaculty =  async (req,res)=>{
    const {userId,isCoor} = req.body;

    const isAlreadyAssigned = await Faculty.findOne({
      where:{
        userId:userId
      }
    })

    if(isAlreadyAssigned) return res.status(409).json({message:"User already assigned!"})
    
    const isCoorCheck = isCoor == null || isCoor == '' ? false : isCoor 

    await Faculty.create({...req.body,isCoor:isCoorCheck})
    res.status(201).json({message:'Successfully Created!'})
    try{
    }catch(e){
        console.log(e);
    }
  }

  exports.deleteFaculty = async (req,res)=>{
    try {
      const {facultyId} = req.params


      const isExist = await Faculty.findOne({
        where:{
          id:facultyId
        }
      })

      if(!isExist) return res.status(404).json({message:'Faculty Member not Found!'})

      await isExist.destroy()

      return res.status(204).json({
        message:'Successfully deleted'
      })


    } catch (error) {
      console.log(error)
    }
  }