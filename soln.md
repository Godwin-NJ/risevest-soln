### **Simple Mode** ( DONE)

- [x] Users can create an account with:
      email address
      password
      full name -

  ### ADD AUTHENTICATION ---- DONE

- [x] Users can upload files up to 200mb ----> DONE
- [x] ????Users can download uploaded files
      download works but issues > needs to point to the os envrionment to drop file
      not the codebase
- [x] Users can create folders to hold files ====> pass this as a params ==>> DONE

### HARD MODE

- [x] An admin user type for managing the content uploaded // This will Involve authorization
- [x] Admins can mark pictures and videos as unsafe //authorization goes in here
- [x] Unsafe files automatically get deleted

##### have an unsafe Endpoint , where ID of the content is passed into it and when triggered the file is ##### assigned an unsafe Boolean and deleted as well. ( array of ID's of intended items/videos to delete)

> [!NOTE]
> below is the outstanding from the hard mode.

- [ ] Users can stream videos and audio

### Ultra Mode

- [ ] Compression
- [ ] File History

### Bonus

- [ ] Revokable session management
- [ ] Multiple admin reviews before file is deleted

### Envr variables to be provided

- JWT_PRIVATE_KEY= :point_right: your jwt secret key
- CLOUD_NAME= :point_right: cloudinary name
- CLOUD_API_KEY= :point_right: cloudinary API_KEY
- CLOUD_API_SECRET= :point_right: cloudinary API_SECRET

> [!NOTE]
> ??>>const maxSize = 200 x (1024 x 1024); // this equivalent to 200mb >>I'm not sure what this conversion is.
> Check on John Smilga Course to re-confirm how it came about.
> https://nodejs.org/api/buffer.html#buffer_class_method_buffer_bytelength_string_encoding > https://stackoverflow.com/questions/46959556/byte-size-of-buffer-javascript-node

### checkout

- how to create schema's and models in postgressql
- trying using ssh to access pgadmin4
