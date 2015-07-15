class User < ActiveRecord::Base

###########
# Associations
###########
  has_many  :answers
  has_many :locations, through: :answers

# separately, Multiple Users are competing on Multiple Journeys
  # has_and_belongs_to_many :journeys

###########
# for User Auth
###########

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # callback on user model: 
  before_save :ensure_authentication_token

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def generate_authentication_token
    # repeat loop if you create a token already in-use
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end


###########
# Methods
###########

  attr_accessor :bonus_points

  def calc_score
    self.points
    # BELOW IS OUT since I will not keep all the answers
    # score is the sum of all answer-points, (plus all journey-bonuses
    # self.answers.pluck(:points).inject(&:+) ? 
    #   self.answers.pluck(:points).inject(&:+) + self['bonus_points'] : self['bonus_points'] 
    # LATER when adding journeys in the models, + self.journeys.pluck(:bonus_points).inject(&:+)
  end

  def update_points (points)
    self.points += points
    self.save
  end

  def count_answers
    self.answers.length
  end

  def global_ranking
    User.all.sort { |a,b| b.calc_score <=> a.calc_score }.index(self) + 1
  end


  # def add_but_only_keep_best (answer, location)  
  #   location.answers << answer
  #   self.answers << answer
  #   ids_to_delete = self.answers.where(location_id: location['id']).order('points desc').pluck(:id).drop(1)
  #   Answer.delete(ids_to_delete)
  # end



end
