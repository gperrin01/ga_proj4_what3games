require 'sinatra'

# set :public_folder, '/client'

get '/' do 
  # send_file File.join(settings.public_folder, 'index.html')
  File.read(File.join('client/public', 'index.html'))
end  