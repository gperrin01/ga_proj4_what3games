class Journey < ActiveRecord::Base

# JOURNEY = unique combo of start and end
  # belongs_to :start_location, class_name: "Location", foreign_key: "start_location_id"
  # belongs_to :end_location, class_name: "Location", foreign_key: "end_location_id"
  # has_and_belongs_to_many :locations

# separately, Multiple Users are competing on Multiple Journeys
  # has_and_belongs_to_many :users

end

