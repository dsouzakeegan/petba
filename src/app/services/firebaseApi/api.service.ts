import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, query, setDoc ,collectionData, where, getDocs, addDoc, docData, orderBy, OrderByDirection} from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, StorageReference, StringFormat, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore : Firestore) { }

  storageRef(imagePath:string)
  {
    const storage = getStorage();
    return ref(storage, imagePath);
  }
  uploadFile(storageRef:StorageReference,file:string,format?:StringFormat)
  {
    var upload;
    if(format)
      {
        upload = uploadString(storageRef, file, format);
      }else{
        upload = uploadString(storageRef, file);
      }
      return upload;
  }
  downloadFile(uploadedStorageFileRef:StorageReference)
  {
   return getDownloadURL(uploadedStorageFileRef)
    
  }
  docRef(path:any )
  {
    return doc(this.firestore,path)

  }

  collectionRef(path:any)
  {
     return collection(this.firestore,path);
  }

  setDocument(path:any, data:any,merge:boolean=true){
    const dataRef =this.docRef(path)
    if(merge)
      {

        return setDoc<any,any>(dataRef,data,{merge:true});
      }else{
        return setDoc<any,any>(dataRef,data);
      }
     

  } 
  addDocument(path:any,data:any)
  {
    const  dataRef =this.collectionRef(path);
    return addDoc<any,any>(dataRef,data); //add
  }



  getDocById(path:any){
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  getDocs(path:any,...queryFn:any)
  {
    let dataRef:any = this.collectionRef(path);
    if(queryFn){
      const q =query(dataRef,...queryFn);
      dataRef=q;

    }
    return getDocs<any,any>(dataRef); //get()

  }
  // getDocs2(path:any,queryFn?:any)
  // {
  //   let dataRef:any = this.collectionRef(path);
  //   if(queryFn){
  //     const q =query(dataRef,queryFn);
  //     dataRef=q;

  //   }
  //   return getDocs<any,any>(dataRef); //get()

  // }
  collectionDataQuery(path:any,id?:any,...queryFn:any)
  {
    let dataRef : any = this.collectionRef(path);
    if(queryFn)
    {
      const q  =query(dataRef,...queryFn);
      dataRef=q;
    }
     let collection_data;
      if(id)
      {
        collection_data = collectionData<any>(dataRef,{idField : 'id'});
        
      }else{
        collection_data = collectionData<any>(dataRef); //value changes for doc use docdata
      
      
      }
      // or
        // collection_data = collectionData<any>(dataRef,{idField:'id'}); //value changes for doc use docdata
      return collection_data;

    }
  // collectionDataQuery(path:any,id?:any,queryFn?:any)
  // {
  //   let dataRef : any = this.collectionRef(path);
  //   if(queryFn)
  //   {
  //     const q  =query(dataRef,queryFn);
  //     dataRef=q;
  //   }
  //    let collection_data;
  //     // if(id)
  //     // {
  //     //   collection_data = collectionData<any>(dataRef,{idField : 'id'});
        
  //     // }else{
  //     //   collection_data = collectionData<any>(dataRef); //value changes for doc use docdata
      
      
  //     // }
  //     // or
  //       collection_data = collectionData<any>(dataRef,{idField:'id'}); //value changes for doc use docdata
  //     return collection_data;

  //   }

   
    whereQuery(fieldPath:any ,condition:any, value:any)
    {
      return where(fieldPath ,condition, value) ;

 
    }

    docDataQuery(path:any,id?:any,queryFn?:any)
    {
      let dataRef :any  =this.docRef(path);
      if(queryFn)
      {
        const q =query(dataRef,queryFn);
        dataRef =q ;

        
      }

      let doc_data ;
      if(id) doc_data = docData<any>(dataRef,{idField: 'id'});
      else doc_data = docData<any>(dataRef);
      return doc_data; 
      
    }
    // docDataQuery(path:any,id?:any,queryFn?:any)
    // {
    //   let dataRef :any  =this.docRef(path);
    //   if(queryFn)
    //   {
    //     const q =query(dataRef,queryFn);
    //     dataRef =q ;

        
    //   }

    //   let doc_data ;
    //   if(id) doc_data = docData<any>(dataRef,{idField: 'id'});
    //   else doc_data = docData<any>(dataRef);
    //   return doc_data; 
      
    // }

    orderByQuery(fieldPath:any,directionStr:OrderByDirection='asc')
    {
      return  orderBy(fieldPath,directionStr)
    }


  }
  
