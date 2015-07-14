class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many  :answers
  has_many :locations, through: :answers

# separately, Multiple Users are competing on Multiple Journeys
  # has_and_belongs_to_many :journeys



  attr_accessor :bonus_points

  def calc_score
    # score is the sum of all answer-points, (plus all journey-bonuses
    self.answers.pluck(:points).inject(&:+) ? 
      self.answers.pluck(:points).inject(&:+) + self['bonus_points'] : self['bonus_points'] 

    # LATER when adding journeys in the models, + self.journeys.pluck(:bonus_points).inject(&:+)
  end

  def update_bonus_points (points)
    self['bonus_points'] += points
    self.save
  end

  def count_answers
    self.answers.length
  end

  def global_ranking
    User.all.sort { |a,b| b.calc_score <=> a.calc_score }.index(self) + 1
  end

  def add_but_only_keep_best (answer, location)  
    location.answers << answer
    self.answers << answer
    ids_to_delete = self.answers.where(location_id: location['id']).order('points desc').pluck(:id).drop(1)
    Answer.delete(ids_to_delete)
  end

end
