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

  def ranking_global
    User.all.sort { |a,b| b.calc_score <=> a.calc_score }.index(self) + 1
  end
  def top3_score_global
    top = User.all.sort { |a,b| b.calc_score <=> a.calc_score }.take(3)
    # get the emails and points [["gperrin01@gmail.com", 300], ["jeremy@jeremy.com", 1]]
    top_five_points = top.map {|user| [user.email, user.points] }
  end

  def top3_answers_global
    top = Answer.all.sort { |a,b| b.points <=> a.points }.take(3)
    # same as above but get the email of the users as well
    top_3_answers_global = top.map {|answer| [User.find(answer.user_id).email, answer.points] }
  end

  def my_best_answer
    Answer.where(user_id: self.id).sort { |a,b| b.points <=> a.points }.first.points
  end

  def top3_answers location_id
    top = Answer.where(location_id: location_id).sort { |a,b| b.points <=> a.points }.take(3)
    # same as above retun user and answer
    top_3_answers_here = top.map {|answer| [User.find(answer.user_id).email, answer.points] }
  end
  def ranking_here location_id
    top = Answer.where(location_id: location_id).sort { |a,b| b.points <=> a.points }
    top.length > 0 ? top.index(self) +1 : 'n/a'
    # Answer.where(location_id: location_id).sort { |a,b| b.points <=> a.points }.index(self) + 1
  end


  # def add_but_only_keep_best (answer, location)  
  #   location.answers << answer
  #   self.answers << answer
  #   ids_to_delete = self.answers.where(location_id: location['id']).order('points desc').pluck(:id).drop(1)
  #   Answer.delete(ids_to_delete)
  # end



end
