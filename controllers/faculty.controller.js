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
        "Head":"Head, Department of Language and Literature"
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
            formattedSuperior.push({name:name,id:data?.id,image:image,role:role,pid:pid})
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
        if(data?.User?.UserCredential?.Course?.acronym === 'BSF'){
          BSFcoor.push(data?.id)
        }else{
          BAELcoor.push(data?.id)
        }
        return {name:name,id:data?.id,image:image,role:data?.role,pid:headId,subRole:`${data?.User?.UserCredential?.Course?.acronym} Program Coordinator`}
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
          
          let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
          let image = data?.User?.image ? data?.User?.image : defaultImage
          return {name:name,id:data?.id,image:image,role:data?.role,pid:pid}
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
          
          let nameBSF = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName}, ${data?.extension}`
          let imageBSF = data?.User?.image ? data?.User?.image : defaultImage
          return {name:nameBSF,id:data?.id,image:imageBSF,role:data?.role,pid:pidBSF}
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